import { Picture } from "./picture";

type Screen = { name: string; alt: string };

/**
 * Vitrina de un proyecto con capturas reales: dos ventanas de navegador encimadas y un celular,
 * en un escenario con perspectiva. El HTML es completo y estático; HomeMotion añade la inclinación
 * con el cursor y el enderezado con el scroll (sin JS o con movimiento reducido queda quieta).
 */
export function Showcase({ url, back, front, phone, caption }: { url: string; back: Screen; front: Screen; phone?: Screen; caption: string }) {
  return <figure className="showcase" data-showcase>
    <div className="showcase-stage">
      <div className="device device-browser device-back" aria-hidden="true">
        <span className="device-bar"><span className="device-url">{url}</span></span>
        <Picture name={back.name} alt="" sizes="(width >= 64rem) 40vw, 90vw" />
      </div>
      <div className="device device-browser device-front">
        <span className="device-bar" aria-hidden="true"><span className="device-url">{url}</span></span>
        <Picture name={front.name} alt={front.alt} sizes="(width >= 64rem) 46vw, 92vw" />
      </div>
      {/* El celular solo aparece si el producto tiene una vista móvil real */}
      {phone && <div className="device device-phone">
        <Picture name={phone.name} alt={phone.alt} sizes="(width >= 64rem) 14vw, 34vw" />
      </div>}
    </div>
    <figcaption>{caption}</figcaption>
  </figure>;
}
