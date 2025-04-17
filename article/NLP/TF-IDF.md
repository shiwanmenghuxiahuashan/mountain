TF-IDF 学习，以及一个用 JavaScript 实现 TF-IDF MVP：

# **TF-IDF 解释**

TF-IDF 是 **词频-逆文档频率 (Term Frequency-Inverse Document Frequency)** 的缩写。它是一种数值统计方法，用于反映一个词语对于一个文档在文档集合或语料库中的重要程度。

* **词频 (TF)：** 衡量一个词语在文档中出现的频率。如果一个词语在文档中出现多次，那么它对于*该文档*来说可能很重要, 可能对文档的主题有较强代表性。
* **逆文档频率 (IDF)：** 衡量一个词语在整个语料库中的稀有程度。如果一个词语在许多文档中都很常见，那么它对于区分这些文档可能没有太大帮助。IDF 会惩罚常见词语，并提高稀有词语的权重, 。IDF越高，说明该词在语料库中出现的文档数越少，具有更强的类别区分能力。

**用途**

高TF-IDF值：表明该词在当前文档中频繁出现（TF高），且在其他文档中罕见（IDF高），是文档的关键特征词。例如，“蜜蜂”在《中国的蜜蜂养殖》一文中TF-IDF值高，因其在文中频繁出现且在其他文档中少见。

TF-IDF 在信息检索和文本挖掘中很有用。它可以帮助完成以下任务：

* **搜索引擎：** 按相关性对搜索结果进行排序。
* **文档分类：** 确定文档的主要内容。
* **关键词提取：** 找到文档中最重要的词语。

**JavaScript TF-IDF MVP**

这是一个展示核心概念的简单 JavaScript 实现。这是一个简化版本（MVP），不包含生产级库中常见的优化或边缘情况处理。

```javascript
    function calculateTF(term, document) {
        // 清理文本，移除标点符号
        const cleanDocument = document.replace(/[.,?!，。？！、]/g, '');
        const docLower = cleanDocument.toLowerCase();
        const termLower = term.toLowerCase();

        // 计算词语在文档中出现的次数
        let count = 0;
        let pos = docLower.indexOf(termLower);

        while (pos !== -1) {
            count++;
            pos = docLower.indexOf(termLower, pos + 1);
        }

        console.log(`'${term}' 出现的次数：`, count);

        // 按文档长度归一化（这里使用字符数作为长度）
        return count / docLower.length;
    }

    function calculateIDF(term, documents) {
        const termLower = term.toLowerCase();
        let documentCount = 0;

        for (const doc of documents) {
            if (doc.toLowerCase().includes(termLower)) {
                documentCount++;
            }
        }

        return documentCount > 0 ? Math.log(documents.length / documentCount) : 0;
    }

    function calculateTFIDF(term, document, documents) {
        const tf = calculateTF(term, document);
        const idf = calculateIDF(term, documents);
        return tf * idf;
    }

    // 示例用法：
    const documents = [
        "我们坚决反对美国搞关税壁垒和贸易霸凌，这种做法损人不利己，违背了经济规律和世界贸易的原则，对世界经济秩序造成严重冲击，拖累世界经济复苏。中方坚决采取一系列反制措施，不仅是维护自身发展利益的需要，也是维护世界多边贸易体系和世贸组织规则的正当之举。",
        "一是经济有基础，内需有支撑。经过40多年改革开放的积累和发展，中国现在是世界第二大经济体，连续15年稳居第一制造业大国的地位，产业体系完整、配套能力强，经济发展底盘稳、基础牢。同时，中国有14亿多人口，市场规模巨大，现在人均GDP超过1.3万美元，正处在消费升级的关键阶段，市场成长性好，无论是投资还是消费空间都非常大，将支撑中国经济持续发展。",
        "市场多元化，出口有韧性。依托于产业配套体系，我国产品具有较强的国际竞争力，在国际上口碑也非常好。近几年，我国积极开拓国际市场，构建贸易多元化格局，成效也非常明显。目前，我们已与世界上150多个国家和地区成为贸易伙伴。另外，我们积极推进与共建“一带一路”国家贸易。今年一季度，对共建“一带一路”国家的出口同比增长7.2%，货物进出口额占全部进出口额比重超过50%，多元化市场格局正在形成，这也意味着我们对某一个国家单一出口市场的依存度在下降。比如，在2018年，我国对美国的出口额占出口总额的比重是19.2%，去年已经下降到14.7%。所以，我国外贸的韧性比较强.",
        "刚刚发布的一季度外贸数据也可以看出来，虽然外部限制增多，但是出口还是增长了6.9%",
    ];

    const term = "市场";

    for (let i = 0; i < documents.length; i++) {
        const tfidf = calculateTFIDF(term, documents[i], documents);
        console.log(`'${term}' 在文档 ${i + 1} 中的 TF-IDF：`, tfidf);
    }
```

**解释**

1.  **`calculateTF(term, document)`：**
    - 计算 `term` 出现的次数。
    - 除以文档中的总词数。
2.  **`calculateIDF(term, documents)`：**
    - 计算包含 `term` 的文档数。
    - 使用公式 `log(文档总数 / 包含该词的文档数)` 计算逆文档频率。我们使用 `log` 来减小 IDF 的影响。
    - 处理词语不在任何文档中出现的情况，以避免除以零。
3.  **`calculateTFIDF(term, document, documents)`：**
    - 计算 TF 和 IDF。
    - 返回它们的乘积。

**重要考虑因素**

* **词语切分 (Tokenization)：** 示例中的词语处理非常基础。实际的 TF-IDF 实现使用更复杂的词语切分来处理标点符号、词干提取和停用词删除（"的"、"是"、"在" 等常见词）。
* **大小写敏感性：** 示例使用 `toLowerCase()` 进行简单的大小写不敏感匹配。
* **平滑处理 (Smoothing)：** IDF 计算有时会进行调整，以防止除以零或平滑稀有词语的影响。
* **性能：** 对于大型数据集，优化至关重要（例如，索引、高效的数据结构）。
