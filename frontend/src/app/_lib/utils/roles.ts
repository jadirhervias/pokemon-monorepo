const GET_HOME_ROUTE_BY_ROLE: Record<string, { home: string; event: string; }> = {
  admin: {
    home: '/admin',
    event: 'admin.medal_evaluation_requested',
  },
  trainer: {
    home: '/trainer',
    event: 'trainer.new_medal_awarded',
  },
};

export enum Role {
  ADMIN = 'admin',
  TRAINER = 'trainer',
};

export const getHomeRouteByRole = (role: Role | null) => {
  if (!role) {
    return '/';
  }

  return GET_HOME_ROUTE_BY_ROLE[role].home ?? '/';
}

export const getEventNameByRole = (role: Role | null) => {
  if (!role) {
    return null;
  }

  return GET_HOME_ROUTE_BY_ROLE[role].event ?? null;
}
