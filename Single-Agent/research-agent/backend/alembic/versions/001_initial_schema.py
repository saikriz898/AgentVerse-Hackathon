"""Initial Database Schema with UUID support for LifeOS Research Agent

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-07-28
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('ix_users_email', 'users', ['email'])

    op.create_table(
        'research_requests',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('user_id', sa.CHAR(36), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('objective', sa.Text(), nullable=False),
        sa.Column('filters', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('execution_time_ms', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False)
    )

    op.create_table(
        'research_results',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('request_id', sa.CHAR(36), sa.ForeignKey('research_requests.id'), nullable=False),
        sa.Column('confidence_score', sa.Integer(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('executive_summary', sa.Text(), nullable=True),
        sa.Column('keywords', sa.JSON(), nullable=True),
        sa.Column('recommendations', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False)
    )

    op.create_table(
        'research_sources',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('result_id', sa.CHAR(36), sa.ForeignKey('research_results.id'), nullable=False),
        sa.Column('title', sa.String(512), nullable=False),
        sa.Column('website_name', sa.String(255), nullable=False),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('published_date', sa.String(100), nullable=True),
        sa.Column('author', sa.String(255), nullable=True),
        sa.Column('content_snippet', sa.Text(), nullable=True),
        sa.Column('credibility_score', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False)
    )

    op.create_table(
        'research_cache',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('query_hash', sa.String(255), nullable=False, unique=True),
        sa.Column('results_json', sa.JSON(), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False)
    )

    op.create_table(
        'agent_logs',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('request_id', sa.CHAR(36), nullable=True),
        sa.Column('agent_name', sa.String(100), nullable=False),
        sa.Column('log_level', sa.String(50), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False)
    )

def downgrade() -> None:
    op.drop_table('agent_logs')
    op.drop_table('research_cache')
    op.drop_table('research_sources')
    op.drop_table('research_results')
    op.drop_table('research_requests')
    op.drop_table('users')
