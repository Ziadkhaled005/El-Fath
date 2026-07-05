import logo from '../../imports/0.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  collapsed?: boolean;
}

export function Logo({ size = 'md', showText = true, collapsed = false }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 64 };
  const px = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="شركة الفتح"
        style={{ width: px, height: px }}
        className="rounded-full object-cover flex-shrink-0"
      />
      {showText && !collapsed && (
        <div>
          <div style={{ fontFamily: 'Cairo, sans-serif', color: '#D4AF37', fontWeight: 700, fontSize: size === 'lg' ? 18 : 14, lineHeight: 1.2 }}>
            شركة الفتح
          </div>
          <div style={{ fontFamily: 'Cairo, sans-serif', color: '#9CA3AF', fontSize: 10, lineHeight: 1.2 }}>
            لإنتاج وتقطير الزيوت العطرية
          </div>
        </div>
      )}
    </div>
  );
}
