export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "phone"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "date"
  | "file"
  | "rating";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  helperText?: string;
  options?: string[]; // for select, checkbox group, radio group
  validation?: {
    min?: number; // min length for string, min value for number
    max?: number; // max length for string, max value for number
    maxFileSize?: number; // in MB, for file upload
    allowedExtensions?: string[]; // e.g. ['.png', '.jpg', '.pdf']
  };
}

export interface Form {
  id: string;
  userId: string;
  name: string;
  description?: string;
  slug: string;
  published: boolean;
  fields: FormField[];
  visits: number;
  submissionsCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface Submission {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submittedAt: any;
  deviceInfo?: string;
}
