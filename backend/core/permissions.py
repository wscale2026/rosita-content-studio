from rest_framework import permissions

class IsStaffUser(permissions.BasePermission):
    """
    Seuls les utilisateurs avec is_staff=True ont accès.
    Bloque les simples 'clients' du site vitrine.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class IsAdminOrProprietaire(permissions.BasePermission):
    """
    Seuls les administrateurs et propriétaires ont accès (Bloque les éditeurs).
    """
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated and request.user.is_staff):
            return False
            
        role = request.user.role.lower() if request.user.role else ''
        is_proprio = request.user.is_superuser or role == 'propriétaire'
        is_admin = is_proprio or role == 'admin' or role == 'administrateur'
        
        return is_admin
