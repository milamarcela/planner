import { useEffect } from "react";
import type { ReactNode } from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";

/**
 * Modal accesible: se cierra con Escape o tocando el fondo, bloquea el scroll
 * de la página mientras está abierto y funciona como hoja inferior en móvil.
 */
export default function Modal({
  title,
  icon,
  onClose,
  children,
}: {
  title: string;
  icon?: IconName;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>
          {icon && <Icon name={icon} size={20} color="var(--primary)" />}
          {title}
          <button type="button" className="ghost icon-btn modal-close" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={16} />
          </button>
        </h3>
        {children}
      </div>
    </div>
  );
}
