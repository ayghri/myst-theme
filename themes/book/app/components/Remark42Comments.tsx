import { useEffect, useRef } from 'react';

export function Remark42Comments({ remark42Id }: { remark42Id: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const win = window as any;
    if (!win.REMARK42) return;
    // Reset and re-init remark42 for this page's comment ID
    win.REMARK42.changeRecordId(remark42Id);
  }, [remark42Id]);

  return (
    <div className="col-body my-10">
      <div ref={rootRef} id="remark42" data-url={remark42Id} />
    </div>
  );
}
