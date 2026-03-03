export interface IUIConfig {
  sections: Array<IUIConfigSection>;
}

export interface IUIConfigSection {
  id: string,
  title: string,
  fields: Array<IUIConfigSectionField>;
}

export interface IUIConfigSectionField {
  key: string,
  label: string,
  help: string,
  type: FieldType,
  visible: boolean,
  editable: boolean,
  required: boolean,
  redact: boolean,
  value: string,
  validation: {
    regex: string
  }
}

export enum FieldType {
  String = 'string',
  Number = 'number',
  Bool = 'bool',
  Secret = 'secret',
  Select = 'select',
  Json = 'json',
  Textarea = 'textarea',
  Url = 'url',
  Email = 'email',
  Cron = 'cron',
  Array = 'array',
  Object = 'object',
}
