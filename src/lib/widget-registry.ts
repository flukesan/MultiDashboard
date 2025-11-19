import { WidgetType } from '@/types';
import { ComponentType } from 'react';

/**
 * Widget Registry
 * Central registry for all widget types
 */

interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  component: ComponentType<any>;
  defaultConfig: Record<string, unknown>;
  defaultLayout: {
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
  };
}

class WidgetRegistry {
  private widgets: Map<WidgetType, WidgetDefinition> = new Map();

  /**
   * Register a widget type
   */
  register(definition: WidgetDefinition): void {
    if (this.widgets.has(definition.type)) {
      console.warn(`Widget type "${definition.type}" is already registered`);
      return;
    }

    this.widgets.set(definition.type, definition);
  }

  /**
   * Unregister a widget type
   */
  unregister(type: WidgetType): void {
    this.widgets.delete(type);
  }

  /**
   * Get widget definition
   */
  get(type: WidgetType): WidgetDefinition | undefined {
    return this.widgets.get(type);
  }

  /**
   * Get all registered widgets
   */
  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Check if widget type is registered
   */
  has(type: WidgetType): boolean {
    return this.widgets.has(type);
  }

  /**
   * Get widget component
   */
  getComponent(type: WidgetType): ComponentType<any> | undefined {
    return this.widgets.get(type)?.component;
  }

  /**
   * Get default config for widget type
   */
  getDefaultConfig(type: WidgetType): Record<string, unknown> {
    return this.widgets.get(type)?.defaultConfig || {};
  }

  /**
   * Get default layout for widget type
   */
  getDefaultLayout(type: WidgetType): WidgetDefinition['defaultLayout'] {
    return (
      this.widgets.get(type)?.defaultLayout || {
        w: 4,
        h: 3,
        minW: 2,
        minH: 2,
      }
    );
  }
}

// Singleton instance
export const widgetRegistry = new WidgetRegistry();

// Export types
export type { WidgetDefinition };
