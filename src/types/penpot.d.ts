declare interface PenpotLibrary {
  local: boolean;
}

declare interface PenpotUI {
  open(name: string, url: string, options: { width?: number; height?: number }): void;
  sendMessage(message: any): void;
  onMessage(callback: (message: any) => void): void;
}

declare interface Penpot {
  createRectangle(): any;
  createText(text?: string): any;
  group(elements: any[]): any;
  selection: any[];
  ui: PenpotUI;
  library: PenpotLibrary;
  theme: string;
  on(event: string, callback: (data: any) => void): void;
}

declare const penpot: Penpot; 