import { FORM_FIELD_ENUM } from "@/config/constants";

export interface FormFieldProps {
  id?: number | string;
  fieldName: string;
  fieldLabel?: string | React.ReactNode;
  placeholder?: string;
  options?: Record<string, unknown>[];
  warningText?: string;
  wordCount?: number;
  fieldDesc?: string;
  as?: FORM_FIELD_ENUM;
  // eslint-disable-next-line no-unused-vars
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string | React.ReactNode;
  prefix?: string;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  validate?: (value: unknown) => string | void | Promise<string | void>;
  labelClassName?: string;
  className?: string;
}
