import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../shared/hooks/useAuth';
import useLayout from '../../layout-1/context/useLayout';
import SidebarAccordion from './SidebarAccordion';
import {
  ItemText,
  ListLabel,
  BulletIcon,
  ICON_STYLE,
  ExternalLink,
  NavItemButton,
} from '@/layouts/layout-1/styles';
import { navigations } from '../../../data/navigation-1';

export default function MultiLevelMenu({ sidebarCompact }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleCloseMobileSidebar } = useLayout();

  const activeRoute = useCallback((path) => pathname === path, [pathname]);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      handleCloseMobileSidebar?.();
    },
    [navigate, handleCloseMobileSidebar]
  );

  const renderIcon = (item) => {
    if (item.icon) {
      return <item.icon sx={ICON_STYLE(activeRoute(item.path))} />;
    } else if (item.iconText) {
      return <span className="item-icon icon-text">{item.iconText}</span>;
    }
    return <BulletIcon active={activeRoute(item.path)} />;
  };

  const renderLevels = (data) => {
    return data.map((item, index) => {
      // LABEL
      if (item.type === 'label') {
        return (
          <ListLabel key={index} compact={sidebarCompact}>
            {t(item.label)}
          </ListLabel>
        );
      }

      // ITEM CON HIJOS
      if (item.children) {
        return (
          <SidebarAccordion key={index} item={item} sidebarCompact={sidebarCompact}>
            {renderLevels(item.children)}
          </SidebarAccordion>
        );
      }

      // LINK EXTERNO
      if (item.type === 'extLink') {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            rel="noopener noreferrer"
            target="_blank"
          >
            <NavItemButton key={item.name} name="child" active>
              {renderIcon(item)}
              <ItemText compact={sidebarCompact} active={activeRoute(item.path)}>
                {item.name}
              </ItemText>
            </NavItemButton>
          </ExternalLink>
        );
      }

      // ITEM NORMAL
      return (
        <NavItemButton
          key={index}
          disabled={item.disabled}
          active={activeRoute(item.path)}
          onClick={() => handleNavigation(item.path)}
        >
          {renderIcon(item)}
          <ItemText compact={sidebarCompact} active={activeRoute(item.path)}>
            {t(item.name)}
          </ItemText>
        </NavItemButton>
      );
    });
  };

  // ------------ FILTRO POR ROL (NUMÉRICO) -------------
  const roleId = user?.role_id;        // 1, 2, 3
  const isAdmin = roleId === 1;        // admin = 1

  const filterByRole = useCallback(
    (items) => {
      // admin ve todo sin filtrar
      if (isAdmin) return items;

      return items
        .map((item) => {
          const hasAccess =
            !item.roles || !roleId || item.roles.includes(roleId);

          // si tiene hijos, filtramos recursivo
          if (item.children) {
            const filteredChildren = filterByRole(item.children);

            // si no tiene acceso y tampoco hijos visibles, se descarta
            if (!hasAccess && filteredChildren.length === 0) {
              return null;
            }

            return { ...item, children: filteredChildren };
          }

          // item sin hijos
          return hasAccess ? item : null;
        })
        .filter(Boolean);
    },
    [roleId, isAdmin]
  );

  const filterNavigation = useMemo(
    () => filterByRole(navigations),
    [filterByRole]
  );

  return <>{renderLevels(filterNavigation)}</>;
}
