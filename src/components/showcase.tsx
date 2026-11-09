import { Picture } from "./picture";
import "./showcase.css";

type Screen = { name: string; alt: string };

/**
 * Vitrina de un proyecto con capturas reales: dos ventanas de navegador encimadas y un celular,
 * en un escenario con perspectiva. El HTML es completo y estático; HomeMotion añade la inclinación
 * con el cursor y el enderezado con el scroll (sin JS o con movimiento reducido queda quieta).
 */
/** Entrada propia de cada proyecto: sello (Hito), portón (Hangar), andenes (TaskFlow). */
export type ShowcaseMotion = "sello" | "porton" | "andenes";

/**
 * `sizes` medidos a 1440, 1024 y 390 px: cada equipo ocupa una fracción fija del escenario
 * (frente 76 %, fondo 70 %, celular 23–27 %). En portada el escenario es media columna; en la
 * página de caso (`wide`) casi todo el ancho. `priority` solo si la vitrina abre la página.
 */
const SIZES = {
  split: { back: "(width >= 64rem) 31vw, 60vw", front: "(width >= 64rem) 35vw, 68vw", phone: "(width >= 64rem) 11vw, 24vw" },
  wide: { back: "(width >= 64rem) 57vw, 60vw", front: "(width >= 64rem) 65vw, 68vw", phone: "(width >= 64rem) 21vw, 24vw" },
} as const;

export function Showcase({ url, back, front, phone, caption, motion, wide = false, priority = false }: { url: string; back: Screen; front: Screen; phone?: Screen; caption: string; motion: ShowcaseMotion; wide?: boolean; priority?: boolean }) {
  const sizes = SIZES[wide ? "wide" : "split"];
  return <figure className="showcase" data-showcase={motion}>
    <div className="showcase-stage">
      <div className="device device-browser device-back" aria-hidden="true">
        <span className="device-bar"><span className="device-url">{url}</span></span>
        <Picture name={back.name} alt="" sizes={sizes.back} eager={priority} />
      </div>
      <div className="device device-browser device-front">
        <span className="device-bar" aria-hidden="true"><span className="device-url">{url}</span></span>
        <Picture name={front.name} alt={front.alt} sizes={sizes.front} priority={priority} />
      </div>
      {/* El celular solo aparece si el producto tiene una vista móvil real */}
      {phone && <div className="device device-phone">
        <Picture name={phone.name} alt={phone.alt} sizes={sizes.phone} eager={priority} />
      </div>}
    </div>
    <figcaption>{caption}</figcaption>
  </figure>;
}
