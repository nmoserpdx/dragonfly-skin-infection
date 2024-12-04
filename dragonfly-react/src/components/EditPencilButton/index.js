const EditPencilButton = ({ onClick, className }) => (
  <div className={`${className}`} onClick={onClick}>
    <svg
      id="Icon_pencil"
      className="!h-[2.7vh]"
      data-name="Icon / pencil"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
    >
      <g id="MDI_pencil" data-name="MDI / pencil">
        <g
          id="Boundary"
          fill="#8b8b8b"
          stroke="rgba(0,0,0,0)"
          strokeWidth="1"
          opacity="0"
        >
          <rect stroke="none" />
          <rect x="0.5" y="0.5" fill="none" />
        </g>
        <path
          id="Path_pencil"
          data-name="Path / pencil"
          d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z"
          transform="translate(0 0.003)"
          fill="#8b8b8b"
        />
      </g>
    </svg>
  </div>
);

export default EditPencilButton;
