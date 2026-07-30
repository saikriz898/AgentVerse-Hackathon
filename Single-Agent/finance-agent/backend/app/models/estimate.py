import datetime
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, JSON
from app.database.session import Base

class ProjectEstimate(Base):
    __tablename__ = "project_estimates"

    id = Column(String, primary_key=True, index=True)
    project_name = Column(String, nullable=False, index=True)
    project_description = Column(Text, nullable=True)
    project_type = Column(String, nullable=False)  # SaaS, Mobile, E-commerce, FinTech, AI Platform
    industry = Column(String, nullable=False)
    expected_users = Column(Integer, default=10000)
    expected_timeline_months = Column(Integer, default=6)
    technology_stack = Column(JSON, default=list)  # React, Node.js, Python, PostgreSQL, etc.
    features = Column(JSON, default=list)
    auth_type = Column(String, default="OAuth + JWT")
    payment_gateway = Column(String, default="Stripe")
    cloud_provider = Column(String, default="AWS")
    database_type = Column(String, default="PostgreSQL")
    ai_features = Column(JSON, default=list)
    deployment_preference = Column(String, default="Docker + Kubernetes")
    security_requirements = Column(String, default="SOC2 + GDPR")
    scalability_requirements = Column(String, default="High (Auto-scaling)")

    # Cost Results
    total_estimated_cost = Column(Float, default=0.0)
    monthly_operating_cost = Column(Float, default=0.0)
    annual_operating_cost = Column(Float, default=0.0)
    dev_cost = Column(Float, default=0.0)
    infra_cost = Column(Float, default=0.0)
    ai_cost = Column(Float, default=0.0)
    devops_cost = Column(Float, default=0.0)
    maintenance_cost = Column(Float, default=0.0)

    # Detailed line items & metadata
    cost_breakdown = Column(JSON, default=dict)
    confidence_score = Column(Float, default=92.0)
    reasoning = Column(Text, nullable=True)
    optimization_suggestions = Column(JSON, default=list)
    risk_assessment = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
