"""increase password_hash length

Revision ID: bb474bbe3799
Revises: 7eae74baae2b
Create Date: 2026-02-11 10:57:46.162130
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'bb474bbe3799'
down_revision = '7eae74baae2b'
branch_labels = None
depends_on = None

def upgrade():
    # Increase the length of password_hash to 255
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column(
            'password_hash',
            existing_type=sa.String(length=100),
            type_=sa.String(length=255),
            existing_nullable=False
        )

def downgrade():
    # Revert password_hash length back to 100
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column(
            'password_hash',
            existing_type=sa.String(length=255),
            type_=sa.String(length=100),
            existing_nullable=False
        )
