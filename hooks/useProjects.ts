import { useCallback, useEffect, useState } from 'react';

import { Database } from '../types/database';

type RoundRow = Database['public']['Tables']['rounds']['Row'];

interface ProjectFilters {
    phase?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface ProjectStats {
    totalRounds: number;
    activeRounds: number;
    totalFunding: string;
    completedMilestones: number;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export const useProjects = () => {
    const [projects, setProjects] = useState<RoundRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    });
    const [stats, setStats] = useState<ProjectStats | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    const fetchProjects = useCallback(
        async (filters: ProjectFilters = {}, page: number = 1) => {
            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: pagination.limit.toString(),
                    ...Object.fromEntries(
                        Object.entries(filters).filter(
                            ([_, value]) => value !== undefined && value !== ''
                        )
                    ),
                });

                const response = await fetch(`/api/rounds?${params}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();

                if (data.success) {
                    setProjects(data.rounds);
                    setPagination(data.pagination);
                } else {
                    throw new Error(data.error || 'Failed to fetch projects');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoading(false);
            }
        },
        [pagination.limit]
    );

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('/api/rounds/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/rounds/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (pagination.hasNext) {
            fetchProjects({}, pagination.page + 1);
        }
    }, [fetchProjects, pagination.hasNext, pagination.page]);

    const refresh = useCallback(() => {
        fetchProjects({}, 1);
        fetchStats();
    }, [fetchProjects, fetchStats]);

    useEffect(() => {
        fetchProjects();
        fetchStats();
        fetchCategories();
    }, []);

    return {
        projects,
        isLoading,
        error,
        pagination,
        stats,
        categories,
        fetchProjects,
        loadMore,
        refresh,
    };
};
