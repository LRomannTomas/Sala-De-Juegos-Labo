import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase;
  
  constructor() { 
    this.supabase = createClient("https://mqklmgwemclsnxjaeajo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2xtZ3dlbWNsc254amFlYWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjgxMjIsImV4cCI6MjA3MzU0NDEyMn0.2rVSVikngfrJQOiLIttSf6Vcb0qpS-HbbDisCFK6j4Q")
  }
}
