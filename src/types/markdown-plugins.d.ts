declare module "markdown-it-task-lists" {
  import type MarkdownIt from "markdown-it";

  interface TaskListsOptions {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }

  function taskLists(md: MarkdownIt, options?: TaskListsOptions): MarkdownIt;
  export default taskLists;
}

declare module "markdown-it-texmath" {
  import type MarkdownIt from "markdown-it";
  import type Katex from "katex";

  interface TexmathOptions {
    engine?: typeof Katex;
    delimiters?: "dollars" | "brackets" | "doxygen" | "beg_end" | string;
    katexOptions?: Katex.KatexOptions;
  }

  function texmath(md: MarkdownIt, options?: TexmathOptions): MarkdownIt;
  export default texmath;
}

declare module "markdown-it-multimd-table" {
  import type MarkdownIt from "markdown-it";

  interface MultimdTableOptions {
    multiline?: boolean;
    rowspan?: boolean;
    headerless?: boolean;
  }

  function multimdTable(md: MarkdownIt, options?: MultimdTableOptions): MarkdownIt;
  export default multimdTable;
}
