
import { supabase } from '@/integrations/supabase/client';

// Function to create the initial admin user
export async function createInitialAdmin() {
  try {
    // Check if we already have admin users
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);
    
    if (checkError) throw checkError;
    
    // If we already have admins, don't create more
    if (existingAdmins && existingAdmins.length > 0) {
      console.log('Admin already exists, skipping seed');
      return existingAdmins[0].id;
    }
    
    // Create an admin user with Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123', // In production, use a strong password
      options: {
        data: {
          name: 'Admin User',
          role: 'admin'
        }
      }
    });
    
    if (authError) throw authError;

    if (!authUser.user) {
      throw new Error('Failed to create admin user');
    }

    console.log('Admin user created:', authUser.user.id);

    // The trigger should automatically create the profile
    // But let's wait a moment to make sure it's processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify the profile was created
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single();

    if (profileError) {
      console.warn('Profile creation might have failed, attempting manually:', profileError);
      
      // Try to create the profile manually
      const { data: manualProfile, error: manualError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user.id,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
        })
        .select()
        .single();
        
      if (manualError) throw manualError;
      
      return manualProfile.id;
    }
    
    return profile.id;
  } catch (error) {
    console.error('Error creating initial admin:', error);
    throw error;
  }
}

// Function to create sample team members
export async function createSampleTeamMembers(count: number = 3) {
  try {
    // Check if we already have enough members
    const { data: existingMembers, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'member');
    
    if (checkError) throw checkError;
    
    if (existingMembers && existingMembers.length >= count) {
      console.log('Enough team members already exist, skipping seed');
      return existingMembers.map(member => member.id);
    }
    
    const memberIds: string[] = existingMembers ? existingMembers.map(member => member.id) : [];
    
    // Create additional members if needed
    const namesToCreate = [
      'João Silva',
      'Maria Costa',
      'Pedro Santos',
      'Ana Oliveira',
      'Carlos Pereira'
    ].slice(0, count - memberIds.length);
    
    for (const name of namesToCreate) {
      const email = name.toLowerCase().replace(' ', '.') + '@example.com';
      
      // Create user with Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email,
        password: 'member123', // In production, use a strong password
        options: {
          data: {
            name,
            role: 'member'
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authUser.user) {
        memberIds.push(authUser.user.id);
        console.log('Team member created:', name, authUser.user.id);
      }
    }
    
    // Wait for triggers to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return memberIds;
  } catch (error) {
    console.error('Error creating sample members:', error);
    throw error;
  }
}

// Function to create sample teams
export async function createSampleTeams(adminId: string, memberIds: string[]) {
  try {
    // Check if we already have teams
    const { data: existingTeams, error: checkError } = await supabase
      .from('teams')
      .select('id');
    
    if (checkError) throw checkError;
    
    if (existingTeams && existingTeams.length > 0) {
      console.log('Teams already exist, skipping seed');
      return existingTeams.map(team => team.id);
    }
    
    // Create sample teams
    const teamsToCreate = [
      {
        name: 'Desenvolvimento',
        description: 'Equipe de Desenvolvimento de Software',
        created_by: adminId
      },
      {
        name: 'Marketing',
        description: 'Equipe de Marketing Digital',
        created_by: adminId
      }
    ];
    
    const teamIds: string[] = [];
    
    for (const team of teamsToCreate) {
      const { data, error } = await supabase
        .from('teams')
        .insert(team)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        teamIds.push(data.id);
        console.log('Team created:', data.name, data.id);
      }
    }
    
    // Add some members to teams (admin is already added via trigger)
    if (memberIds.length > 0) {
      // Add first two members to first team
      if (teamIds[0] && memberIds[0]) {
        await supabase
          .from('team_members')
          .insert({ team_id: teamIds[0], user_id: memberIds[0] });
      }
      
      if (teamIds[0] && memberIds[1]) {
        await supabase
          .from('team_members')
          .insert({ team_id: teamIds[0], user_id: memberIds[1] });
      }
      
      // Add last member to second team
      if (teamIds[1] && memberIds[2]) {
        await supabase
          .from('team_members')
          .insert({ team_id: teamIds[1], user_id: memberIds[2] });
      }
    }
    
    return teamIds;
  } catch (error) {
    console.error('Error creating sample teams:', error);
    throw error;
  }
}

// Function to create sample tasks
export async function createSampleTasks(adminId: string, memberIds: string[], teamIds: string[]) {
  try {
    // Check if we already have tasks
    const { data: existingTasks, error: checkError } = await supabase
      .from('tasks')
      .select('id');
    
    if (checkError) throw checkError;
    
    if (existingTasks && existingTasks.length > 0) {
      console.log('Tasks already exist, skipping seed');
      return;
    }
    
    // Create sample tasks
    const tasksToCreate = [
      {
        title: 'Implementar autenticação',
        description: 'Adicionar sistema de login com JWT',
        assignee_id: memberIds[0] || adminId,
        team_id: teamIds[0],
        status: 'todo',
        priority: 'high',
        created_by: adminId,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Design da página inicial',
        description: 'Criar wireframes para a homepage',
        assignee_id: memberIds[1] || adminId,
        team_id: teamIds[0],
        status: 'in-progress',
        priority: 'medium',
        created_by: adminId,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Campanha nas redes sociais',
        description: 'Planejar postagens para Instagram e Facebook',
        assignee_id: memberIds[2] || adminId,
        team_id: teamIds[1],
        status: 'review',
        priority: 'medium',
        created_by: adminId,
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Otimização de SEO',
        description: 'Melhorar ranqueamento do site nos buscadores',
        assignee_id: memberIds[2] || adminId,
        team_id: teamIds[1],
        status: 'todo',
        priority: 'high',
        created_by: memberIds[2] || adminId,
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Corrigir bugs no painel',
        description: 'Resolver problemas reportados no dashboard',
        assignee_id: memberIds[0] || adminId,
        team_id: teamIds[0],
        status: 'done',
        priority: 'high',
        created_by: memberIds[0] || adminId,
        due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    for (const task of tasksToCreate) {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        console.log('Task created:', data.title, data.id);
      }
    }
  } catch (error) {
    console.error('Error creating sample tasks:', error);
    throw error;
  }
}

// Main seed function that runs everything
export async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    const adminId = await createInitialAdmin();
    const memberIds = await createSampleTeamMembers(3);
    const teamIds = await createSampleTeams(adminId, memberIds);
    await createSampleTasks(adminId, memberIds, teamIds);
    console.log('Database seed completed successfully!');
    return true;
  } catch (error) {
    console.error('Database seed failed:', error);
    return false;
  }
}
