export interface Document {
  id: string;
  org_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  folder_id?: string;
  uploaded_by: string;
  version: number;
  is_current_version: boolean;
  tags?: string[];
  created_at: string;
  folder?: Folder;
}

export interface Folder {
  id: string;
  org_id: string;
  name: string;
  parent_folder_id?: string;
  created_by: string;
  created_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_url: string;
  uploaded_by: string;
  changes_description?: string;
  created_at: string;
}
