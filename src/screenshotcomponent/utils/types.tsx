export interface EditorProps {
  imageUrl: string;
  width: number;
  height: number;
  editing: boolean;
  handleEdit: (edit: boolean) => void;
  handleSave: (dataUrl: string) => void;
  // imageHistory: ImageData[];
  // savedComments: Array<TextToolInterface>;
  // historyChangeCount: number
  // saveHistory: (data: ImageData[], index: number) => void;
  // saveComments: (data: Array<TextToolInterface>) => void;
}

export interface PreviewImageProps {
  sectionDataUrl: Array<SectionProps> | null;
  dataUrl: string;
  type: string;
  handleClose: () => void;
}

export interface ImageObject {
  url: string;
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageHistory: ImageData[];
  savedComments: Array<TextToolInterface>;
  historyIndex: number
  finalDataUrl: string;
}

export interface SectionProps {
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface SectionCaptureInterface {
  onCapture: (
    sectionsData: Array<SectionProps>,
    fullScreenData: string
  ) => void;
}

export interface EditorState {
  tool: "pen" | "text" | "blur";
  color: string;
  size: number;
  font: string;
  blurIntensity: number;
}

export interface TextToolInterface {
  x: number;
  y: number;
  text: string;
  hovered: boolean;
  id?: string;
}
