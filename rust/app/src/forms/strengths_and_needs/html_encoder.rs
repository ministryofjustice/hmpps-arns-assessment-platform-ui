//! HTML encoding for answers shown in summaries.

pub fn escape(input: &str) -> String {
    input
        .replace('&', "&amp;")
        .replace('"', "&quot;")
        .replace('\'', "&#x27;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('/', "&#x2F;")
        .replace('\\', "&#x5C;")
        .replace('`', "&#96;")
        .replace("\r\n", "\n")
        .replace('\r', "\n")
}

pub fn unescape(input: &str) -> String {
    input
        .replace("&amp;", "&")
        .replace("&quot;", "\"")
        .replace("&#x27;", "'")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&#x2F;", "/")
        .replace("&#x5C;", "\\")
        .replace("&#96;", "`")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trips() {
        let s = "a & b < c > \"d\" 'e' / \\ `f`";
        assert_eq!(unescape(&escape(s)), s);
        assert_eq!(escape("x\r\ny\rz"), "x\ny\nz");
    }
}
