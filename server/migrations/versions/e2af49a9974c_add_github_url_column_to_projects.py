"""add github_url column to projects

Revision ID: e2af49a9974c
Revises: a845d91d7f1d
Create Date: 2026-02-09 01:17:48.983685
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2af49a9974c'
down_revision = 'a845d91d7f1d'
branch_labels = None
depends_on = None


def upgrade():
    # Add github_url with a default for existing rows
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('github_url', sa.String(length=255), nullable=False, server_default='')
        )


def downgrade():
    # Remove the column
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.drop_column('github_url')
