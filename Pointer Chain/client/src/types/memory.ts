export interface Process {
  name: string;
  pid: number;
  icon: string;
  isDangerous?: boolean;
}

export interface MemoryNode {
  id: string;
  name: string;
  offset: string;
  icon: string;
  color: string;
  value?: string | number | object | boolean;
  valueType?: 'int32' | 'float' | 'Vec3' | 'string' | 'Array';
  children?: MemoryNode[];
  isExpanded?: boolean;
  description?: string;
}

export interface ResolvedValue {
  id: string;
  name: string;
  type: string;
  address: string;
  value: any;
  description: string;
  color: string;
  icon: string;
}
