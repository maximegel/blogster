import remark from 'remark';
import { Node as UnistNode } from 'unist';

/** Syntax tree representation of a post content as defined by [mdast](https://github.com/syntax-tree/mdast). */
export type PostContent = Root;

export const stringifyContent = (content: PostContent): string => remark().stringify((content as unknown) as UnistNode);

export type Nodes = {
  thematicBreak: ThematicBreak;
  definition: Definition;
  break: Break;
  image: Image;
  imageReference: ImageReference;
} & Parents &
  Literals;

export interface Parents {
  root: Root;
  paragraph: Paragraph;
  heading: Heading;
  blockquote: Blockquote;
  list: List;
  listItem: ListItem;
  emphasis: Emphasis;
  strong: Strong;
  link: Link;
  linkReference: LinkReference;
}

export interface Literals {
  html: HTML;
  code: Code;
  definition: Definition;
  text: Text;
  inlineCode: InlineCode;
}

export type NodeType = keyof Nodes;
export type ParentType = keyof Parents;
export type LiteralType = keyof Literals;

//#region Nodes

/** Represents a [mdast](https://github.com/syntax-tree/mdast) node. */
export interface Node<T extends NodeType = NodeType> {
  type: T;
  data?: Record<string, unknown>;
}

/**
 * Represents a [mdast](https://github.com/syntax-tree/mdast) node containing other nodes (said to be
 * [children](https://github.com/syntax-tree/unist#child)).
 */
export interface Parent<T extends ParentType = ParentType, C extends TreeContent = TreeContent> extends Node<T> {
  children: C[];
}

/** Represents a [mdast](https://github.com/syntax-tree/mdast) node containing a value. */
export interface Literal<T extends LiteralType = LiteralType> extends Node<T> {
  value: string;
}

/** Represents a document. */
export type Root = Parent<'root', FlowContent>;
/**
 * Represents a unit of discourse dealing with a particular point or idea.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * Alpha bravo charlie.
 * ```
 */

export type Paragraph = Parent<'paragraph', PhrasingContent>;

/**
 * Represents a heading of a section.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * # Alpha
 * ```
 */
export interface Heading extends Parent<'heading', PhrasingContent> {
  /** A value of `1` is said to be the highest rank and `6` the lowest. */
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Represents a thematic break, such as a scene change in a story, a transition to another topic, or a new document.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * ***
 * ```
 */
export type ThematicBreak = Node<'thematicBreak'>;

/**
 * Represents a section quoted from somewhere else.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * > Alpha bravo charlie.
 * ```
 */
export type Blockquote = Parent<'blockquote', FlowContent>;

/**
 * Represents a list of items.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * 1. foo
 * ```
 */
export interface List extends Parent<'list', ListContent> {
  /**
   * Represents that the items have been intentionally ordered (when `true`), or that the order of items is not
   * important (when `false` or not present).
   */
  ordered?: boolean;
  /** Represents, when the `ordered` field is `true`, the starting number of the list. */
  start?: number;
  /**
   * Represents that one or more of its children are separated with a blank line from its siblings (when `true`), or not
   * (when `false` or not present).
   */
  spread?: boolean;
}

/**
 * Represents an item in a `List`.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * * bar
 * ```
 */
export interface ListItem extends Parent<'listItem', FlowContent> {
  /**
   * Represents that the item contains two or more children separated by a blank line (when `true`), or not (when
   * `false` or not present).
   */
  spread?: boolean;
}

/**
 * Represents a fragment of raw [HTML](https://html.spec.whatwg.org/multipage/).
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * <div>
 * ```
 */
export type HTML = Literal<'html'>;

/**
 * Represents a block of preformatted text, such as ASCII art or computer code.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * ```js highlight-line="2"
 * foo()
 * bar()
 * baz()
 * ```
 * ```
 */
export interface Code extends Literal<'code'> {
  /** Represents the language of computer code being marked up. */
  lang?: string;
  /** If the `lang` field is present, represents custom information relating to the node. */
  meta?: string;
}

/**
 * Represents a resource.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * [Alpha]: https://example.com
 * ```
 */
export type Definition = Node<'definition'> & Association & Resource;

/**
 * Represents everything that is just text.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * Alpha bravo charlie.
 * ```
 */
export type Text = Literal<'text'>;

/**
 * Represents stress emphasis of its contents.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * *alpha* _bravo_
 * ```
 */
export type Emphasis = Parent<'emphasis', TransparentContent>;

/**
 * Represents strong importance, seriousness, or urgency for its contents.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * **alpha** __bravo__
 * ```
 */
export type Strong = Parent<'strong', TransparentContent>;

/**
 * Represents a fragment of computer code, such as a file name, computer program, or anything a computer could parse.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * `foo()`
 * ```
 */
export type InlineCode = Literal<'inlineCode'>;

/**
 * Represents a line break, such as in poems or addresses.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * foo··
 * bar
 * ```
 */
export type Break = Node<'break'>;

/**
 * Represents a hyperlink.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * [alpha](https://example.com "bravo")
 * ```
 */
export type Link = Parent<'link', StaticPhrasingContent> & Resource;

/**
 * Represents an image.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * ![alpha](https://example.com/favicon.ico "bravo")
 * ```
 */
export type Image = Node<'image'> & Resource & Alternative;

/**
 * Represents a hyperlink through association, or its original source if there is no association.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * [alpha][Bravo]
 * ```
 */
export type LinkReference = Parent<'linkReference', StaticPhrasingContent> & Reference;

/**
 * Represents an image through association, or its original source if there is no association.
 * @example <caption>For example, the following Markdown:</caption>
 * ```markdown
 * ![alpha][bravo]
 * ```
 */
export type ImageReference = Node<'imageReference'> & Reference & Alternative;

//#endregion

//#region Mixins

/** Represents a reference to resource. */
export interface Resource {
  /** Represents a URL to the referenced resource. */
  url: string;
  /** Represents advisory information for the resource, such as would be appropriate for a tooltip. */
  title?: string;
}

/** Represents an internal relation from one node to another. */
export interface Association {
  /** Character escapes and character references are not parsed. Its value must be normalized. */
  identifier: string;
  /** Works just like `title` on a link or a `lang` on code: character escapes and character references are parsed. */
  label?: string;
}

/** Represents a marker that is associated to another node. */
export interface Reference extends Association {
  /** Represents the explicitness of the reference. */
  referenceType: ReferenceType;
}

/** Represents a node with a fallback. */
export interface Alternative {
  /** Represents equivalent content for environments that cannot represent the node as intended. */
  alt?: string;
}

//#endregion

//#region Enumerations

export enum ReferenceType {
  /** The reference is implicit, its identifier inferred from its content. */
  SHORTCUT = 'shortcut',
  /** The reference is explicit, its identifier inferred from its content. */
  COLLAPSED = 'collapsed',
  /** The reference is explicit, its identifier explicitly set. */
  FULL = 'full',
}

//#endregion

//#region Content models

/** All categories of content that group nodes with similar characteristics together. */
export type TreeContent = FlowContent | ListContent | PhrasingContent;

/** Represents the sections of document. */
export type FlowContent = Blockquote | Code | Heading | HTML | List | ThematicBreak | Content;

/** Represents runs of text that form definitions and paragraphs. */
export type Content = Definition | Paragraph;

/** Represent the items in a list. */
export type ListContent = ListItem;

/** Represent the text in a document, and its markup. */
export type PhrasingContent = Link | LinkReference | StaticPhrasingContent;

/** Represent the text in a document, and its markup, that is not intended for user interaction. */
export type StaticPhrasingContent = Break | Emphasis | HTML | Image | ImageReference | InlineCode | Strong | Text;

/**
 * Derived from the content model of its parent. Effectively, this is used to prohibit nested links (and link
 * references).
 */
export type TransparentContent = TreeContent;

//#endregion
