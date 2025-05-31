Table users{
 id uuid pk
 name varchar(20)
 username varchar(50)
 password varchar(100)
 banned_until datetime
 isDefaultPassword bool
 isActive bool
 type char // 0: Staff 1: Agent
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table agents{
 id int pk
 user_id uuid [ref: - users.id]
 identity_type char // 0: KTP 1: SIM
 bank_id int [ref: > banks.id]
 account_number int
 phone varchar (20)
 email varchar (15)
 balance int
 address varchar (20)
 lead_id uuid [ref: > agents.id]
 coordinator_id uuid [ref: > agents.id]
 target_remaining int
 isActive bool
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table fees{
 id int pk
 name varchar(20)
 amount int
 desc varchar(100)
 isActive bool
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table agent_fee_transaction{
 id int pk
 agent_id int [ref: > agents.id]
 amount int
 type char // 0:Debit 1:Kredit
 description varchar
 trx_date datetime
 refrence_id int
 category char
 last_balance int
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table agent_sosmed{
 id int pk
 agent_id int [ref: > agents.id]
 social_id int [ref: > social_media.id]
 url varchar (50)
 isActive bool
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table social_media{
 id int pk
 name varchar(20)
 isActive bool
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table banks{
 id int pk
 bank_code varchar
 name varchar(20)
 isActive bool
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table user_roles{
 id uuid pk
 user_id uuid [ref: > users.id]
 roles_id uuid [ref: > roles.id]
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table roles{
 id int pk
 name varchar(50)
 description varchar(100)
 isActive bool
 type char // 0: Staff 1: Agent
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table user_roles_menu{
 id int pk
 user_role_id uuid [ref: > user_roles.id]
 menu_id uuid [ref: > menus.id]
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table menus{
 id int pk
 name varchar(50)
 desc varchar(50)
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}

Table list_api{
 id int pk
 menu_id uuid [ref: > menus.id]
 name varchar(50)
 url varchar(50)
 parent_id int
 order int
 created_by uuid
 created_at datetime
 updated_by uuid
 uppdated_at datetime
}