export interface Task{

    id?:string;

    title:string;

    description?:string;

    category:string;

    priority:string;

    status:string;

    deadline?:string;

    is_completed?:boolean;

    user_id?:string;

    created_at?:string;

    updated_at?:string;

}