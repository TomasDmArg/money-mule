export interface ProjectAnalysis {
    id: string;
    projectName: string;
    fileName: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    uploadedAt: string;
    progress: number;
    result?: ProjectResult;
}

export interface ProjectResult {
    status?: string;
    project_name?: string;
    summary?: string;
    viability_score?: number;
    viability_explanation?: string;
    viability_breakdown?: {
        team_score?: number;
        market_score?: number;
        product_score?: number;
        business_model_score?: number;
        execution_score?: number;
    };
    risk_factors?: string[];
    strengths?: string[];
    recommendation?: string;
    founders?: Founder[];
    detailed_analysis?: DetailedAnalysis;
    competitor_analysis?: CompetitorAnalysis;
    followup_questions?: FollowupQuestions;
}

export interface Founder {
    name?: string;
    role?: string;
    deck_bio?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    bio?: string;
    company?: string;
    score?: number;
    contribution?: string;
    technical_score?: number;
    business_score?: number;
    gitroll_user_id?: string | null;
    gitroll_score?: number | null;
}

export interface DetailedAnalysis {
    description?: string;
    problem?: string;
    solution?: string;
    target_market?: string;
    business_model?: string;
}

export interface CompetitorAnalysis {
    market_saturation?: string;
    competitive_advantage?: string;
    threat_level?: string;
}

export interface FollowupQuestions {
    priority_questions?: FollowupQuestion[];
}

export interface FollowupQuestion {
    question: string;
    category: string;
    priority: string;
    rationale: string;
}
