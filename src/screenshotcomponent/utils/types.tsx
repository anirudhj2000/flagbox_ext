export interface EditorProps {
  imageUrl: string;
  width: number;
  height: number;
}

export interface PreviewImageProps {
  sectionDataUrl: Array<SectionProps>;
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
