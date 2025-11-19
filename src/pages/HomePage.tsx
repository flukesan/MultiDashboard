import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomePageStore } from '@/store/homepage-store';
import { useDashboardStore } from '@/store/dashboard-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Edit,
  Plus,
  Upload,
  Settings,
  Trash2,
  Save,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationButton as NavigationButtonType } from '@/types';

interface DraggableButtonProps {
  button: NavigationButtonType;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onNavigate: () => void;
}

function DraggableButton({
  button,
  isEditing,
  isSelected,
  onSelect,
  onPositionChange,
  onNavigate,
}: DraggableButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditing) return;
    setIsDragging(true);
    onSelect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = button.position.x;
    const startPosY = button.position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const deltaX = ((moveEvent.clientX - startX) / containerRect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / containerRect.height) * 100;

      const newX = Math.max(0, Math.min(95, startPosX + deltaX));
      const newY = Math.max(0, Math.min(95, startPosY + deltaY));

      onPositionChange({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (buttonRef.current && !container) {
      let parent = buttonRef.current.parentElement;
      while (parent && !parent.classList.contains('homepage-container')) {
        parent = parent.parentElement;
      }
      setContainer(parent as HTMLDivElement);
    }
  }, [container]);

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-6 text-lg',
  };

  const size = button.style?.size || 'md';
  const bgColor = button.style?.backgroundColor || '#667eea';
  const textColor = button.style?.textColor || '#ffffff';

  return (
    <motion.div
      ref={buttonRef}
      className={cn(
        'absolute cursor-pointer',
        isEditing && 'cursor-move',
        isDragging && 'z-50'
      )}
      style={{
        left: `${button.position.x}%`,
        top: `${button.position.y}%`,
      }}
      onMouseDown={isEditing ? handleDragStart : undefined}
      onClick={!isEditing ? onNavigate : onSelect}
      whileHover={{ scale: isEditing ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isSelected ? 1.1 : 1,
        boxShadow: isSelected
          ? '0 0 0 3px rgba(102, 126, 234, 0.5)'
          : isDragging
          ? '0 10px 30px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(0,0,0,0.15)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className={cn(
          'rounded-lg font-semibold shadow-lg transition-all',
          sizeClasses[size],
          isEditing && 'border-2 border-dashed border-white/50'
        )}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {button.label}
      </div>
    </motion.div>
  );
}

export function HomePage() {
  const { config, editMode, selectedButtonId, setEditMode, setSelectedButton, loadConfig } =
    useHomePageStore();
  const { dashboards, switchDashboard } = useDashboardStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBgDialog, setShowBgDialog] = useState(false);

  // Form states
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonDashboard, setNewButtonDashboard] = useState('');
  const [newButtonSize, setNewButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [newButtonBgColor, setNewButtonBgColor] = useState('#667eea');
  const [newButtonTextColor, setNewButtonTextColor] = useState('#ffffff');

  const { addButton, removeButton, updateButton, updateButtonPosition, setBackgroundImage } =
    useHomePageStore();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleAddButton = () => {
    if (!newButtonLabel || !newButtonDashboard) return;

    addButton({
      label: newButtonLabel,
      dashboardId: newButtonDashboard,
      position: { x: 40, y: 40 },
      style: {
        size: newButtonSize,
        backgroundColor: newButtonBgColor,
        textColor: newButtonTextColor,
      },
    });

    // Reset form
    setNewButtonLabel('');
    setNewButtonDashboard('');
    setNewButtonSize('md');
    setNewButtonBgColor('#667eea');
    setNewButtonTextColor('#ffffff');
    setShowAddDialog(false);
  };

  const handleEditButton = () => {
    if (!selectedButtonId) return;

    const button = config.buttons.find((b) => b.id === selectedButtonId);
    if (!button) return;

    updateButton(selectedButtonId, {
      label: newButtonLabel,
      dashboardId: newButtonDashboard,
      style: {
        size: newButtonSize,
        backgroundColor: newButtonBgColor,
        textColor: newButtonTextColor,
      },
    });

    setShowEditDialog(false);
    setSelectedButton(null);
  };

  const handleDeleteButton = () => {
    if (!selectedButtonId) return;
    removeButton(selectedButtonId);
    setSelectedButton(null);
  };

  const openEditDialog = () => {
    const button = config.buttons.find((b) => b.id === selectedButtonId);
    if (!button) return;

    setNewButtonLabel(button.label);
    setNewButtonDashboard(button.dashboardId);
    setNewButtonSize(button.style?.size || 'md');
    setNewButtonBgColor(button.style?.backgroundColor || '#667eea');
    setNewButtonTextColor(button.style?.textColor || '#ffffff');
    setShowEditDialog(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setBackgroundImage(base64);
      setShowBgDialog(false);
    };
    reader.readAsDataURL(file);
  };

  const handleNavigate = (dashboardId: string) => {
    switchDashboard(dashboardId);
    // Will be handled by App component to show Dashboard view
  };

  const backgroundStyle = config.backgroundImage?.startsWith('linear-gradient')
    ? { background: config.backgroundImage }
    : { backgroundImage: `url(${config.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };

  return (
    <div className="relative w-full h-screen overflow-hidden homepage-container" style={backgroundStyle}>
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Top toolbar */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            IIoT Dashboard Platform
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? 'default' : 'secondary'}
            onClick={() => setEditMode(!editMode)}
            className="gap-2"
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4" />
                Done Editing
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit Mode
              </>
            )}
          </Button>

          {editMode && (
            <>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Button
              </Button>

              <Button onClick={() => setShowBgDialog(true)} variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Background
              </Button>

              {selectedButtonId && (
                <>
                  <Button onClick={openEditDialog} variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Edit
                  </Button>

                  <Button onClick={handleDeleteButton} variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          {config.buttons.map((button) => (
            <DraggableButton
              key={button.id}
              button={button}
              isEditing={editMode}
              isSelected={selectedButtonId === button.id}
              onSelect={() => setSelectedButton(button.id)}
              onPositionChange={(position) => updateButtonPosition(button.id, position)}
              onNavigate={() => handleNavigate(button.dashboardId)}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {config.buttons.length === 0 && !editMode && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
                Welcome to IIoT Dashboard Platform
              </h2>
              <p className="text-xl mb-8 drop-shadow-md">
                Click "Edit Mode" to add navigation buttons to your dashboards
              </p>
            </div>
          </div>
        )}

        {editMode && config.buttons.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white/70">
              <p className="text-2xl drop-shadow-md">
                Click "Add Button" to create your first navigation button
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Button Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Navigation Button</DialogTitle>
            <DialogDescription>
              Create a new button to navigate to a dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Button Label</Label>
              <Input
                value={newButtonLabel}
                onChange={(e) => setNewButtonLabel(e.target.value)}
                placeholder="e.g., Production Dashboard"
              />
            </div>

            <div>
              <Label>Target Dashboard</Label>
              <Select value={newButtonDashboard} onValueChange={setNewButtonDashboard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dashboard" />
                </SelectTrigger>
                <SelectContent>
                  {dashboards.map((dashboard) => (
                    <SelectItem key={dashboard.id} value={dashboard.id}>
                      {dashboard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Button Size</Label>
              <Select value={newButtonSize} onValueChange={(v: string) => setNewButtonSize(v as 'sm' | 'md' | 'lg')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newButtonBgColor}
                    onChange={(e) => setNewButtonBgColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={newButtonBgColor}
                    onChange={(e) => setNewButtonBgColor(e.target.value)}
                    placeholder="#667eea"
                  />
                </div>
              </div>

              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newButtonTextColor}
                    onChange={(e) => setNewButtonTextColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={newButtonTextColor}
                    onChange={(e) => setNewButtonTextColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddButton} disabled={!newButtonLabel || !newButtonDashboard}>
              Add Button
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Button Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Navigation Button</DialogTitle>
            <DialogDescription>
              Update button properties
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Button Label</Label>
              <Input
                value={newButtonLabel}
                onChange={(e) => setNewButtonLabel(e.target.value)}
                placeholder="e.g., Production Dashboard"
              />
            </div>

            <div>
              <Label>Target Dashboard</Label>
              <Select value={newButtonDashboard} onValueChange={setNewButtonDashboard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dashboard" />
                </SelectTrigger>
                <SelectContent>
                  {dashboards.map((dashboard) => (
                    <SelectItem key={dashboard.id} value={dashboard.id}>
                      {dashboard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Button Size</Label>
              <Select value={newButtonSize} onValueChange={(v: string) => setNewButtonSize(v as 'sm' | 'md' | 'lg')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newButtonBgColor}
                    onChange={(e) => setNewButtonBgColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={newButtonBgColor}
                    onChange={(e) => setNewButtonBgColor(e.target.value)}
                    placeholder="#667eea"
                  />
                </div>
              </div>

              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newButtonTextColor}
                    onChange={(e) => setNewButtonTextColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={newButtonTextColor}
                    onChange={(e) => setNewButtonTextColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditButton} disabled={!newButtonLabel || !newButtonDashboard}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Background Upload Dialog */}
      <Dialog open={showBgDialog} onOpenChange={setShowBgDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Background</DialogTitle>
            <DialogDescription>
              Upload an image or choose a gradient
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Upload Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label>Or Choose a Gradient</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Purple Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                  { name: 'Orange Red', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                  { name: 'Green Blue', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
                  { name: 'Dark Tech', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
                  { name: 'Sunset', value: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
                  { name: 'Night Sky', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
                ].map((gradient) => (
                  <Button
                    key={gradient.name}
                    variant="outline"
                    onClick={() => {
                      setBackgroundImage(gradient.value);
                      setShowBgDialog(false);
                    }}
                    className="h-20 relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: gradient.value }}
                    />
                    <span className="relative z-10 text-white font-semibold drop-shadow-md">
                      {gradient.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBgDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
