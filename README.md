# Material Tracker

A modern material request tracking application built with React, TypeScript, and Supabase.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, Shadcn/UI
-   **State Management**: Zustand, TanStack Query
-   **Database**: Supabase (PostgreSQL)
-   **Routing**: React Router DOM

## Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A Supabase project

## Environment Setup

1.  Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```

2.  Update the `.env` file with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
    ```

## Database Setup

Run the following SQL in your Supabase SQL Editor to set up the necessary tables and security policies.

### 1. Create Tables

```sql
-- Create Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  status text default 'active'
);

-- Create Profiles Table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,

  constraint username_length check (char_length(username) >= 3)
);

-- Create Material Requests Table
create table material_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  material_name text not null,
  quantity numeric not null,
  unit text not null,
  status text not null default 'pending',
  priority text not null default 'medium',
  requested_by uuid references profiles(id) on delete cascade not null,
  requested_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects(id) on delete set null,
  notes text,
  
  -- Constraints for Enums/Types
  constraint status_check check (status in ('pending', 'approved', 'rejected', 'delivered')),
  constraint priority_check check (priority in ('low', 'medium', 'high', 'urgent'))
);
```

### 2. Set Up Row Level Security (RLS)

Enable RLS on all tables to secure your data.

```sql
-- Enable RLS
alter table profiles enable row level security;
alter table projects enable row level security;
alter table material_requests enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Projects Policies
create policy "Projects are viewable by authenticated users."
  on projects for select
  to authenticated
  using ( true );

-- Material Requests Policies
create policy "Users can view all requests."
  on material_requests for select
  to authenticated
  using ( true );

create policy "Users can insert their own requests."
  on material_requests for insert
  to authenticated
  with check ( auth.uid() = requested_by );

create policy "Users can update their own requests."
  on material_requests for update
  to authenticated
  using ( auth.uid() = requested_by );
  
create policy "Users can delete their own requests."
  on material_requests for delete
  to authenticated
  using ( auth.uid() = requested_by );
```

### 3. Set Up Triggers for User Management

Automatically create a profile entry when a new user signs up.

```sql
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Running the Project

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.
