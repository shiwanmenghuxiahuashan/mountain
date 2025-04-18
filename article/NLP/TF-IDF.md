# **TF-IDF**

**TF-IDF** 是 **词频-逆文档频率 (Term Frequency-Inverse Document Frequency)** 的缩写。

它是一种广泛使用的数值统计方法，旨在量化一个词语对于一个文档在整个文档集合或语料库中的**重要程度**。TF-IDF 的核心思想是：一个词语的重要性随着它在文档中出现的次数呈正比增加，但随着它在整个语料库中出现的频率呈反比下降。

TF-IDF 值由两个部分组成：

* **词频 (TF，Term Frequency)：** 衡量一个词语在**当前文档**中出现的频繁程度。如果一个词语在文档中出现的次数越多，它的词频就越高。高词频通常表明该词语在文档中扮演着重要的角色。计算方法可以是简单计数，也可以进行归一化处理（例如，词语出现次数除以文档总词数）。

* **逆文档频率 (IDF，Inverse Document Frequency)：** 衡量一个词语在**整个文档集合**中的稀有程度或普遍性。如果一个词语在越少的文档中出现，它的逆文档频率就越高。高 IDF 值意味着该词语在语料库中相对罕见，因此在区分不同文档时更具有价值和独特性。IDF 的计算通常涉及对包含该词语的文档数取对数并取倒数。

**计算公式:**

TF-IDF 是词频 (TF) 和逆文档频率 (IDF) 的乘积：

$$TF-IDF(t, d, D) = TF(t, d) \times IDF(t, D)$$

其中：
* $t$: 目标词语 (term)
* $d$: 当前文档 (document)
* $D$: 文档集合或语料库 (corpus)
* $TF(t, d)$: 词语 $t$ 在文档 $d$ 中的词频。
* $IDF(t, D) = \log\left(\frac{N}{DF(t)}\right)$
    - $N$: 文档集合 $D$ 中的总文档数。
    - $DF(t)$: 包含词语 $t$ 的文档数（Document Frequency）。通常在计算 IDF 时会进行一些平滑处理，例如加上 1，以避免分母为零的情况，公式可能略有变动，但核心思想不变。

## **用途**

一个词语的 TF-IDF 值越高，表明它在**当前文档中出现的频率较高（TF 高），同时在整个文档集合中出现的频率较低（IDF 高）**。
这样的词语往往更能代表当前文档的独特主题或内容，是文档的重要特征词。

**例如：** 在一个关于农业的文档集合中，词语“蜜蜂”如果在《中国的蜜蜂养殖》这篇文章中频繁出现 (TF 高)，而在其他关于玉米、小麦的文档中很少出现 (IDF 高)，那么“蜜蜂”在这个文档中的 TF-IDF 值就会很高，表明它是这篇特定文章的关键内容词。

TF-IDF 作为一种简单而有效的特征提取方法，在信息检索和文本挖掘领域有着广泛的应用，主要包括：

* **信息检索与搜索引擎：** 根据用户输入的查询词的 TF-IDF 值，对搜索结果中的文档进行相关性排序，将最相关的文档排在前面。
* **文档关键词提取：** 识别文档中 TF-IDF 值最高的词语，将其作为文档的关键词，帮助快速了解文档主旨。
* **文本相似度计算：** 将文档表示为词语的 TF-IDF 向量，通过计算向量之间的相似度（如余弦相似度）来衡量文档之间的相似性。
* **文本分类与聚类：** 将文档的 TF-IDF 向量作为机器学习模型的特征输入，用于训练文本分类器或对文档进行聚类。

## **TF-IDF js MVP**

这是一个通过 js 实现的 **最小可行产品 （MVP）**，只作为核心概念理解演示使用, 而非用于生产环境。

```javascript
/**
 * 计算词语在文档中的词频 (TF, Term Frequency)。
 * 这里的实现为了简化，使用了字符匹配和文档总字符数进行归一化。
 * 实际应用中通常需要先进行分词，并用文档总词数进行归一化。
 * @param {string} term - 要计算词频的词语。
 * @param {string} document - 输入文档字符串。
 * @returns {number} - 词语在文档中的词频（归一化后）。
 */
function calculateTF(term, document) {
    // 简单的文本清理：移除常见标点符号
    const cleanDocument = document.replace(/[.,?!，。？！、]/g, '')
    const docLower = cleanDocument.toLowerCase()
    const termLower = term.toLowerCase()

    // 计算词语出现的次数（基于字符匹配）
    let count = 0
    let pos = docLower.indexOf(termLower)

    while (pos !== -1) {
        count++
        pos = docLower.indexOf(termLower, pos + 1)
    }

    // 归一化：按文档的总字符数归一化
    // 注意：更标准的TF计算是按文档的总词数归一化
    const totalChars = docLower.length
    return totalChars > 0 ? count / totalChars : 0
}

/**
 * 计算词语的逆文档频率 (IDF, Inverse Document Frequency)。
 * 衡量词语在整个文档集合中的稀有程度。
 * @param {string} term - 要计算 IDF 的词语。
 * @param {string[]} documents - 文档字符串数组（语料库）。
 * @returns {number} - 词语的逆文档频率。
 */
function calculateIDF(term, documents) {
    const termLower = term.toLowerCase()
    let documentCount = 0 // 包含该词语的文档数

    for (const doc of documents) {
        // 检查文档是否包含该词语（基于字符匹配）
        if (doc.toLowerCase().includes(termLower)) {
            documentCount++
        }
    }

    // 计算 IDF: log(文档总数 / 包含该词语的文档数)
    // 使用 log 是为了减小 IDF 值的范围。处理 documentCount 为 0 的情况。
    const totalDocuments = documents.length
    return documentCount > 0 ? Math.log(totalDocuments / documentCount) : 0
}

/**
 * 计算词语在特定文档中的 TF-IDF 值。
 * @param {string} term - 要计算 TF-IDF 的词语。
 * @param {string} document - 目标文档字符串。
 * @param {string[]} documents - 文档字符串数组（语料库）。
 * @returns {object} - 包含词语、文档、TF、IDF 和 TF-IDF 值的对象。
 */
function calculateTFIDF(term, document, documents) {
    const tf = calculateTF(term, document)
    const idf = calculateIDF(term, documents)
    return {
        term,
        document: document.substring(0, 50) + '...', // 截取文档开头部分方便展示
        tf,
        idf,
        tfidf: tf * idf
    }
}

// 示例用法：
const documents = [
    '我们坚决反对美国搞关税壁垒和贸易霸凌，这种做法损人不利己，违背了经济规律和世界贸易的原则，对世界经济秩序造成严重冲击，拖累世界经济复苏。中方坚决采取一系列反制措施，不仅是维护自身发展利益的需要，也是维护世界多边贸易体系和世贸组织规则的正当之举。',

    '一是经济有基础，内需有支撑。经过40多年改革开放的积累和发展，中国现在是世界第二大经济体，连续15年稳居第一制造业大国的地位，产业体系完整、配套能力强，经济发展底盘稳、基础牢。同时，中国有14亿多人口，市场规模巨大，现在人均GDP超过1.3万美元，正处在消费升级的关键阶段，市场成长性好，无论是投资还是消费空间都非常大，将支撑中国经济持续发展。',

    '市场多元化，出口有韧性。依托于产业配套体系，我国产品具有较强的国际竞争力，在国际上口碑也非常好。近几年，我国积极开拓国际市场，构建贸易多元化格局，成效也非常明显。目前，我们已与世界上150多个国家和地区成为贸易伙伴。另外，我们积极推进与共建“一带一路”国家贸易。今年一季度，对共建“一带一路”国家的出口同比增长7.2%，货物进出口额占全部进出口额比重超过50%，多元化市场格局正在形成，这也意味着我们对某一个国家单一出口市场的依存度在下降。比如，在2018年，我国对美国的出口额占出口总额的比重是19.2%，去年已经下降到14.7%。所以，我国外贸的韧性比较强.',

    '刚刚发布的一季度外贸数据也可以看出来，虽然外部限制增多，但是出口还是增长了6.9%'
]

const term = '市场' // 想要计算 TF-IDF 的词语

console.log(`计算词语 "${term}" 在每个文档中的 TF-IDF 值：\n`)

for (let i = 0; i < documents.length; i++) {
    const result = calculateTFIDF(term, documents[i], documents)
    // 使用 console.log 替代 console.table，以更好地控制输出格式和避免浏览器兼容性问题
    console.log(`文档 ${i + 1}:`)
    console.log(`  TF: ${result.tf.toFixed(6)}`) // 保留小数点后6位
    console.log(`  IDF: ${result.idf.toFixed(6)}`)
    console.log(`  TF-IDF: ${result.tfidf.toFixed(6)}\n`)
}
```

**js的好处是，你现在可以在浏览器中运行它，而不需要安装任何东西。** 请在浏览器里运行, 替换 `documents` 数组和 `term` 变量，看看不同词语在不同文档中的 TF-IDF 值如何变化。

### MVP的局限性和实际应用的差异

这个简单的 MVP 实现展示了 TF-IDF 的基本思想，但在实际应用中，有许多重要的方面需要更复杂的处理：

* **分词 (Tokenization)：** TF-IDF 算法主要适用于英文(中文等非空格分隔的语言)，中文首先要分词，分词后要解决多词一义，以及一词多义问题，这两个问题通过简单的tf-idf方法不能很好的解决。于是就有了后来的词嵌入方法，用向量来表征一个词。此 MVP 示例直接将输入视为字符序列进行匹配，这无法准确识别有意义的词语单元，会严重影响结果的准确性。实际应用需要使用成熟的中文分词库。
* **文本预处理：** 除了简单的标点移除，实际应用通常还需要进行更全面的文本清洗，例如：
    - **统一大小写：** 虽然示例中做了，但需要强调。
    - **移除停用词 (Stop Words Removal)：** 删除“的”、“是”、“在”等在所有文档中都非常常见且没有实际语义区分能力的词语。
    - **词干提取 (Stemming) 或词形还原 (Lemmatization)：** 将词语还原到其基本形式（例如，“running”、“runs”、“ran”都归为“run”），以减少词汇量的冗余。
* **TF 和 IDF 的平滑处理：** 为了避免某些极端情况（例如，词语在语料库中从未出现导致 IDF 无穷大，或某个文档中词语总数为零），TF 和 IDF 的计算公式通常会进行一些平滑处理。
* **性能与效率：** 对于处理大型文档集合，遍历计算的方式效率较低。实际的 TF-IDF 实现会使用更高效的数据结构（如哈希表）和算法来构建词汇表、统计词频和文档频率，并可能使用稀疏矩阵来存储 TF-IDF 向量。
* **向量化：** TF-IDF 常用的输出形式不是针对单个词语的得分，而是将整个文档表示为一个 TF-IDF 向量，其中向量的每个维度对应词汇表中的一个词语，值就是该词语在文档中的 TF-IDF 分数。

## C-TF-IDF

> ps: 使用 BERTopic 主题建模时候才接触这个。。之前么得听说过

C-TF-IDF 是一种改进的 TF-IDF 方法，主要用于文本分类和聚类任务。

C-TF-IDF 的核心思想是：在计算 TF-IDF 时，不仅考虑词语在文档中的频率，还考虑该词语在**某个特定的“类”或“主题”**中的重要性。

在主题建模的上下文中，这里的“类”或“主题”就是算法发现的一个主题簇。c-TF-IDF 用于找出在某个主题下最具有代表性、最能区分该主题与其他主题的词语。

**计算公式 (BERTopic 中的实现):**

$c-TF-IDF(t, c, D_{all}) = \frac{TF(t, c)}{N_c} \times \log\left(\frac{N_{all}}{DF(t, D_{all})}\right)$

其中：
* $t$: 词语 (term)
* $c$: 主题或类 (class/topic)
* $D_{all}$: 所有文档的集合（注意，这里通常指**所有被分配到某个主题的文档集合**，而不是最初的全部语料库，这取决于具体的实现细节）。
* $TF(t, c)$: 词语 $t$ 在属于主题 $c$ 的所有文档中出现的总频率。
* $N_c$: 属于主题 $c$ 的所有文档中的总词数（或者简单地是属于主题 $c$ 的文档数，取决于 TF 的定义）。BERTopic 官方文档中提到是所有文档中词的总数，但具体实现中可能有所不同，核心是衡量词在类内的频率。
* $N_{all}$: **所有被分配到某个主题的文档的总数**。
* $DF(t, D_{all})$: 包含词语 $t$ 的主题数（而不是文档数）。这是与传统 TF-IDF 的一个关键区别。BERTopic 官方文档中描述为 "the number of documents across all topics the word $t$ occurred in"。这与计算词语在所有文档中出现的文档频率类似，但上下文是所有主题的集合。

### 感谢

感谢AI助手的帮助，特别是对 C-TF-IDF 的解释和公式的推导。以及提升学习效率的帮助。

## 参考资料

* [机器学习：生动理解TF-IDF算法](https://zhuanlan.zhihu.com/p/31197209)
* [TF-IDF算法解释](https://www.simcf.cc/3590.html)
* [一文看懂 TF-IDF (概念图解+4大变种+发展历史)](https://easyai.tech/ai-definition/tf-idf/)
* [TF-IDF算法原理及其使用详解](https://zhuanlan.zhihu.com/p/94446764)
* [TF-IDF - Wikipedia](https://en.wikipedia.org/wiki/Tf-idf)
* [BERTopic - Official Documentation](https://maartengr.github.io/BERTopic/index.html)
