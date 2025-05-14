interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-yellow-50 to-stone-100">
      <main className="px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
