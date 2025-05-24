interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-[80vh] bg-white">
      <main className="px-4 py-6 bg-white">{children}</main>
    </div>
  );
};

export default Layout;
