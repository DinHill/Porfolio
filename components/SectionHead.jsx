const SectionHead = ({ num, eyebrow, title, muted, children }) => {
  return (
    <div className="sec-head">
      <div className="reveal">
        <span className="eyebrow"><i /><b>{num}</b> {eyebrow}</span>
        <h2 className="sec-title">
          {title}
          {muted && (
            <>
              <br />
              <span className="muted">{muted}</span>
            </>
          )}
        </h2>
      </div>
      {children && <p className="sec-sub reveal" style={{ "--d": ".08s" }}>{children}</p>}
    </div>
  );
};

export default SectionHead;
