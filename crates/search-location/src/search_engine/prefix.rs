pub fn is_prefix(prefix: &str, word: &str) -> bool {
    prefix.len() <= word.len()
        && prefix
            .chars()
            .zip(word.chars())
            .all(|(c_a, c_b)| c_a == c_b)
}
