from dataclasses import dataclass


@dataclass(frozen=True)
class Principal:
    user_id: str
    role: str
    workspace_id: str


ROLE_PERMISSIONS = {
    "viewer": {"read:documents", "read:traces", "read:evaluations"},
    "operator": {"read:documents", "read:traces", "read:evaluations", "run:tasks", "write:documents"},
    "admin": {"read:documents", "read:traces", "read:evaluations", "run:tasks", "write:documents", "approve:actions", "manage:workspace"},
}


def can(principal: Principal, permission: str) -> bool:
    return permission in ROLE_PERMISSIONS.get(principal.role, set())


def require_permission(principal: Principal, permission: str) -> None:
    if not can(principal, permission):
        raise PermissionError(f"Principal {principal.user_id} does not have {permission}")
