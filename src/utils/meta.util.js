const DEFAULT_KEYWORDS = "";
const DEFAULT_DESC = "";

const createMetaData = (
    title,
    keywords = DEFAULT_KEYWORDS,
    desc = DEFAULT_DESC,
    robots = 'index, follow',
  ) => {
    if (Array.isArray(keywords)) {
      keywords = keywords.join(', ');
    }

    return {
      title,
      keywords,
      desc,
      robots,
    };
  };



export { createMetaData };
