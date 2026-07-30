from sqlalchemy.orm import Session
from app.ai.financial_architect import financial_architect
from app.models.estimate import ProjectEstimate
from app.schemas.estimate import EstimationRequest
import uuid
import datetime

class EstimationService:
    def create_estimate(self, db: Session, request: EstimationRequest, hourly_rate: float = 85.0) -> ProjectEstimate:
        raw_res = financial_architect.generate_estimation(request, hourly_rate=hourly_rate)

        db_obj = ProjectEstimate(
            id=raw_res["id"],
            project_name=request.project_name,
            project_description=request.project_description,
            project_type=request.project_type,
            industry=request.industry,
            expected_users=request.expected_users,
            expected_timeline_months=request.expected_timeline_months,
            technology_stack=request.technology_stack,
            features=request.features,
            auth_type=request.auth_type,
            payment_gateway=request.payment_gateway,
            cloud_provider=request.cloud_provider,
            database_type=request.database_type,
            ai_features=request.ai_features,
            deployment_preference=request.deployment_preference,
            security_requirements=request.security_requirements,
            scalability_requirements=request.scalability_requirements,
            total_estimated_cost=raw_res["total_estimated_cost"],
            monthly_operating_cost=raw_res["monthly_operating_cost"],
            annual_operating_cost=raw_res["annual_operating_cost"],
            dev_cost=raw_res["dev_cost"],
            infra_cost=raw_res["infra_cost"],
            ai_cost=raw_res["ai_cost"],
            devops_cost=raw_res["devops_cost"],
            maintenance_cost=raw_res["maintenance_cost"],
            cost_breakdown=raw_res["cost_breakdown"],
            confidence_score=raw_res["confidence_score"],
            reasoning=raw_res["reasoning"],
            optimization_suggestions=raw_res["optimization_suggestions"],
            risk_assessment=raw_res["risk_assessment"]
        )

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_estimates(self, db: Session, limit: int = 10):
        return db.query(ProjectEstimate).order_by(ProjectEstimate.created_at.desc()).limit(limit).all()

    def get_estimate_by_id(self, db: Session, estimate_id: str):
        return db.query(ProjectEstimate).filter(ProjectEstimate.id == estimate_id).first()

estimation_service = EstimationService()
