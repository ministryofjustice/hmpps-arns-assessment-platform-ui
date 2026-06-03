type DiffNode =
  | { type: "added"; value: unknown }
  | { type: "removed"; value: unknown }
  | { type: "changed"; before: unknown; after: unknown }
  | { type: "unchanged"; value: unknown }
  | { type: "object"; children: Record<string, DiffNode> }
  | { type: "array"; children: DiffNode[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function escapeHtml(value: string): string {
  return value
    ?.replace(/&/g, "&amp;")
    ?.replace(/</g, "&lt;")
    ?.replace(/>/g, "&gt;");
}

function renderValue(value: unknown): string {
  return escapeHtml(JSON.stringify(value));
}

function getOrderedKeys(
  left: Record<string, unknown>,
  right: Record<string, unknown>
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  // Preserve original left-side ordering first
  for (const key of Object.keys(left)) {
    seen.add(key);
    result.push(key);
  }

  // Append genuinely new right-side keys
  for (const key of Object.keys(right)) {
    if (!seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }

  return result;
}

function diffJson(left: unknown, right: unknown): DiffNode {
  // Unchanged
  if (deepEqual(left, right)) {
    return {
      type: "unchanged",
      value: left,
    };
  }

  // Arrays
  if (Array.isArray(left) && Array.isArray(right)) {
    const max = Math.max(left.length, right.length);

    return {
      type: "array",
      children: Array.from({ length: max }, (_, i) => {
        if (i >= left.length) {
          return {
            type: "added",
            value: right[i],
          };
        }

        if (i >= right.length) {
          return {
            type: "removed",
            value: left[i],
          };
        }

        return diffJson(left[i], right[i]);
      }),
    };
  }

  // Objects
  if (isObject(left) && isObject(right)) {
    const keys = getOrderedKeys(left, right);

    const children: Record<string, DiffNode> = {};

    for (const key of keys) {
      const hasLeft = key in left;
      const hasRight = key in right;

      if (!hasLeft) {
        children[key] = {
          type: "added",
          value: right[key],
        };
      } else if (!hasRight) {
        children[key] = {
          type: "removed",
          value: left[key],
        };
      } else {
        children[key] = diffJson(
          left[key],
          right[key]
        );
      }
    }

    return {
      type: "object",
      children,
    };
  }

  // Primitive change
  return {
    type: "changed",
    before: left,
    after: right,
  };
}

function renderDiff(
  node: DiffNode,
  indent = 0,
  key?: string
): string {
  const pad = "&nbsp;".repeat(indent * 2);

  switch (node.type) {
    case "unchanged":
      return `<div class="line unchanged">${pad}${
        key ? `"${key}": ` : ""
      }${renderValue(node.value)}</div>`;

    case "added":
      return `<div class="line added">${pad}+ ${
        key ? `"${key}": ` : ""
      }${renderValue(node.value)}</div>`;

    case "removed":
      return `<div class="line removed">${pad}- ${
        key ? `"${key}": ` : ""
      }${renderValue(node.value)}</div>`;

    case "changed":
      return `
<div class="line removed">${pad}- ${
        key ? `"${key}": ` : ""
      }${renderValue(node.before)}</div>
<div class="line added">${pad}+ ${
        key ? `"${key}": ` : ""
      }${renderValue(node.after)}</div>`;

    case "object": {
      const children = Object.entries(node.children)
        .map(([childKey, childNode]) =>
          renderDiff(childNode, indent + 1, childKey)
        )
        .join("");

      return `
<div class="line unchanged">${pad}${
        key ? `"${key}": ` : ""
      }{</div>
${children}
<div class="line unchanged">${pad}}</div>`;
    }

    case "array": {
      const children = node.children
        .map((child) =>
          renderDiff(child, indent + 1)
        )
        .join("");

      return `
<div class="line unchanged">${pad}${
        key ? `"${key}": ` : ""
      }[</div>
${children}
<div class="line unchanged">${pad}]</div>`;
    }
  }
}

export function diffHtml(left: unknown, right: unknown): string {
  const diff = diffJson(left, right);
  return `<div class="json-diff">${renderDiff(diff)}</div>`;
}
