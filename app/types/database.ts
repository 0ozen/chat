export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			messages: {
				Row: {
					content: string;
					created_at: string;
					id: string;
					user_id: string | null;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: string;
					user_id?: string | null;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: string;
					user_id?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
