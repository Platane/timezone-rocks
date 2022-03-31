pub struct SearchEngine {
    word_list: Vec<String>,
}

impl SearchEngine {
    pub fn create(word_list: Vec<String>) -> SearchEngine {
        SearchEngine { word_list }
    }
    pub fn search(&self, pattern: &str) -> Vec<&String> {
        let results: Vec<_> = self
            .word_list
            .iter()
            .filter(|w| is_prefix(pattern, w))
            .take(3)
            .collect();

        results
    }
}

fn is_prefix(prefix: &str, word: &str) -> bool {
    prefix.len() <= word.len()
        && prefix
            .chars()
            .zip(word.chars())
            .all(|(c_a, c_b)| c_a == c_b)
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn it_should_return_word_matching_pattern() {
        let se = SearchEngine::create(vec![
            "blue".to_string(),
            "moon".to_string(),
            "orange".to_string(),
            "red".to_string(),
            "carmin".to_string(),
        ]);

        let results = se.search("blu");
        let expected = vec!["blue"];

        assert_eq!(&expected[..], &results[..]);
    }
}
