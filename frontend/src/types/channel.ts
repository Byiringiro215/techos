export interface Channel {
  id: string;
  org_id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  description?: string;
  created_by: string;
  created_at: string;
}

export interface ChannelMember {
  id: string;
  channel_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  parent_message_id?: string;
  has_attachments: boolean;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}
