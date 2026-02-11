"""merge migration branches

Revision ID: 701b5c704b36
Revises: 4fb1ca885d0c, bb474bbe3799
Create Date: 2026-02-11 15:58:12.192019

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '701b5c704b36'
down_revision = ('4fb1ca885d0c', 'bb474bbe3799')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
