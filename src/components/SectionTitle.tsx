interface Props {
    content: string;
}

const SectionTitle = ({ content }: Props) => {
    return <h2 className="mb-8 md:mb-12 text-3xl">{content}</h2>;
};

export default SectionTitle;
