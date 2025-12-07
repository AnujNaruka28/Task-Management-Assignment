const Footer = () => {
    return (
        <footer className="flex w-full justify-center items-center py-6 bg-[#1c1917] border-t border-stone-800 mt-auto">
            <p className="text-stone-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} Task Management. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
