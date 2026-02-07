# Extracted Content from en.wikipedia.org

**Source:** https://en.wikipedia.org/wiki/Attention_Is_All_You_Need
**Crawled:** 2026-02-02T05:19:22.094Z
**Pages:** 3 extracted, 1 skipped
**Tokens:** ~16 088 estimated
**Duration:** 5s

---

## Table of Contents

1. [Attention Is All You Need](#attention-is-all-you-need)
2. [Wikipedia:Contents - Wikipedia](#wikipediacontents-wikipedia)
3. [Main Page](#main-page)

---

## Attention Is All You Need

> Source: https://en.wikipedia.org/wiki/Attention_Is_All_You_Need
> Tokens: ~9 936

An illustration of main components of the transformer model from the paper

"**Attention Is All You Need**"\[1\] is a 2017 landmark\[2\]\[3\] [research paper](https://en.wikipedia.org/wiki/Academic_publishing) in [machine learning](https://en.wikipedia.org/wiki/Machine_learning) authored by eight scientists working at [Google](https://en.wikipedia.org/wiki/Google). The paper introduced a new [deep learning](https://en.wikipedia.org/wiki/Deep_learning) architecture known as the [transformer](https://en.wikipedia.org/wiki/Transformer_(machine_learning_model)), based on the [attention mechanism](https://en.wikipedia.org/wiki/Attention_mechanism) proposed in 2014 by Bahdanau *et al.*\[4\] It is considered a foundational\[5\] paper in modern [artificial intelligence](https://en.wikipedia.org/wiki/Artificial_intelligence), and a main contributor to the [AI boom](https://en.wikipedia.org/wiki/AI_boom), as the transformer approach has become the main architecture of a wide variety of AI, such as [large language models](https://en.wikipedia.org/wiki/Large_language_model).\[6\]\[7\] At the time, the focus of the research was on improving [Seq2seq](https://en.wikipedia.org/wiki/Seq2seq) techniques for [machine translation](https://en.wikipedia.org/wiki/Machine_translation), but the authors go further in the paper, foreseeing the technique's potential for other tasks like [question answering](https://en.wikipedia.org/wiki/Question_answering) and what is now known as [multimodal](https://en.wikipedia.org/wiki/Modality_(human%E2%80%93computer_interaction)) [generative AI](https://en.wikipedia.org/wiki/Generative_AI).\[1\]

Some early examples that the team tried their Transformer architecture on included English-to-German translation, generating Wikipedia articles on "The Transformer", and [parsing](https://en.wikipedia.org/wiki/Parsing). These convinced the team that the Transformer is a general-purpose language model, and not just good for translation.\[8\]

As of 2025, the paper has been cited more than 173,000 times, placing it among the top ten most-cited papers of the 21st century.\[9\] After the paper was published by Google, each of the authors left the company to join other companies or to found [startups](https://en.wikipedia.org/wiki/Startup_company).

The authors of the paper are: [Ashish Vaswani](https://en.wikipedia.org/wiki/Ashish_Vaswani), [Noam Shazeer](https://en.wikipedia.org/wiki/Noam_Shazeer), [Niki Parmar](https://en.wikipedia.org/w/index.php?title=Niki_Parmar&action=edit&redlink=1), [Jakob Uszkoreit](https://en.wikipedia.org/w/index.php?title=Jakob_Uszkoreit&action=edit&redlink=1), Llion Jones, [Aidan Gomez](https://en.wikipedia.org/wiki/Aidan_Gomez), Łukasz Kaiser, and [Illia Polosukhin](https://en.wikipedia.org/w/index.php?title=Illia_Polosukhin&action=edit&redlink=1). All eight authors were "equal contributors" to the paper; the listed order was randomized (according to the paper itself). After the paper, each of the authors left Google to join other companies or to found [startups](https://en.wikipedia.org/wiki/Startup_company).\[10\]\[11\]

The paper's title is a reference to the song "[All You Need Is Love](https://en.wikipedia.org/wiki/All_You_Need_Is_Love)" by [the Beatles](https://en.wikipedia.org/wiki/The_Beatles).\[12\] The name "Transformer" was picked because Jakob Uszkoreit, one of the paper's authors, liked the sound of that word.\[8\] An early design document was titled "Transformers: Iterative Self-Attention and Processing for Various Tasks", and included an illustration of six characters from the *[Transformers](https://en.wikipedia.org/wiki/Transformers)* franchise. The team was named Team Transformer.\[12\]

## Methods discussed and introduced

\[[edit](https://en.wikipedia.org/w/index.php?title=Attention_Is_All_You_Need&action=edit&section=2)\]

The paper is best known for introducing the Transformer architecture, which underlies most modern [large language models (LLMs)](https://en.wikipedia.org/wiki/Large_language_model). A key reason why the architecture is preferred by most modern LLMs is the parallelizability of the architecture over its predecessors. This ensures that the operations necessary for training can be accelerated on a GPU, allowing both faster training times and models of bigger sizes to be trained.

The paper introduced the following mechanisms as part of the development of the transformer architecture.

**Scaled dot-product attention & self-attention**

The use of the scaled dot-product attention and self-attention mechanism instead of a [recurrent neural network](https://en.wikipedia.org/wiki/Recurrent_neural_network) or [long short-term memory](https://en.wikipedia.org/wiki/Long_short-term_memory) (which rely on recurrence instead) allows for better performance as described in the following paragraph. The paper described the scaled dot-product attention as follows:

![{\displaystyle {\rm {Attention}}(Q,K,V):={\rm {softmax}}\left({\frac {Q\times K^{T}}{\sqrt {d_{k}}}}\right)\times V}](https://wikimedia.org/api/rest_v1/media/math/render/svg/53e2907dbdb5412f15e89d60c8b8d2323f737b03)

where ![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed), ![{\displaystyle K}](https://wikimedia.org/api/rest_v1/media/math/render/svg/2b76fce82a62ed5461908f0dc8f037de4e3686b0), ![{\displaystyle V}](https://wikimedia.org/api/rest_v1/media/math/render/svg/af0f6064540e84211d0ffe4dac72098adfa52845) are respectively the query, key, value matrices, and ![{\displaystyle d_{k}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b78f5b2abc48e63b987b6d7527caa5aa9b1bb512) is the dimension of the values.

Since the model relies on Query (*Q*), Key (*K*), and Value (*V*) matrices that come from the same source (i.e., the input sequence or context window), this eliminates the need for RNNs, completely ensuring parallelizability for the architecture. This differs from the original form of the Attention mechanism introduced in 2014. Additionally, the paper also discusses the use of an additional scaling factor that was found to be most effective with respect to the dimension of the key vectors (represented as ![{\displaystyle d_{k}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b78f5b2abc48e63b987b6d7527caa5aa9b1bb512) and initially set to 64 within the paper) in the manner shown above.

In the specific context of translation, which the paper focused on, the Query and Key matrices are usually represented in embeddings corresponding to the source language, while the Value matrix corresponds to the target language.

**Multi-head attention**

In the self-attention mechanism, queries (Q), keys (K), and values (V) are dynamically generated for each input sequence (typically limited by the size of the context window), allowing the model to focus on different parts of the input sequence at different steps. Multi-head attention enhances this process by introducing multiple parallel attention heads. Each attention head learns different linear projections of the Q, K, and V matrices. This allows the model to capture different aspects of the relationships between words in the sequence simultaneously, rather than focusing on a single aspect.

By doing this, multi-head attention ensures that the input embeddings are updated from a more varied and diverse set of perspectives. After the attention outputs from all heads are calculated, they are concatenated and passed through a final linear transformation to generate the output.

**Positional encoding**

Since the Transformer does not rely on recurrence or convolution of the text in order to perform encoding and decoding, the paper relied on the use of sine and cosine wave functions to encode the position of the token into the embedding. The methods introduced in the paper are discussed below:

![{\displaystyle PE_{({\rm {pos}},2i)}=\sin({\rm {pos}}/{10000}^{2i/d_{\rm {model}}})}](https://wikimedia.org/api/rest_v1/media/math/render/svg/9a4cda057350682de8ee1f4067589017b936bdae)

![{\displaystyle PE_{({\rm {pos}},2i+1)}=\cos({\rm {pos}}/{10000}^{2i/d_{\rm {model}}})}](https://wikimedia.org/api/rest_v1/media/math/render/svg/3f392bf05eb32f513c7f4060dafd0a1efe740630)

wherein ![{\displaystyle {\rm {pos}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/e0af26676e3b1445ec641cf895eca7b39bdd871a), ![{\displaystyle i}](https://wikimedia.org/api/rest_v1/media/math/render/svg/add78d8608ad86e54951b8c8bd6c8d8416533d20), ![{\displaystyle {d_{\rm {model}}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/9eacb2f262b30f2082b23bca855362f7a9776bd6) correspond to the position of the word, the current dimension index, and the dimension of the model, respectively. The sine function is used for even indices of the embedding while the cosine function is used for odd indices. The resultant ![{\displaystyle PE}](https://wikimedia.org/api/rest_v1/media/math/render/svg/3618f41498880a11110aadc8495b704cebacb831) embedding is then added to the word at that corresponding position with respect to the current context window. The paper specifically comments on why this method was chosen describing:

"We chose the sinusoidal version because it may allow the model to extrapolate to sequence lengths longer than the ones encountered during training."\[1\]

For many years, sequence modelling and generation was done by using plain [recurrent neural networks](https://en.wikipedia.org/wiki/Recurrent_neural_network) (RNNs). A well-cited early example was the [Elman network](https://en.wikipedia.org/wiki/Elman_network) (1990). In theory, the information from one token can propagate arbitrarily far down the sequence, but in practice the [vanishing-gradient problem](https://en.wikipedia.org/wiki/Vanishing-gradient_problem) leaves the model's state at the end of a long sentence without precise, extractable information about preceding tokens.

A key breakthrough was [LSTM](https://en.wikipedia.org/wiki/Long_short-term_memory) (1995),\[note 1\] an RNN which used various innovations to overcome the vanishing gradient problem, allowing efficient learning of long-sequence modelling. One key innovation was the use of an [attention mechanism](https://en.wikipedia.org/wiki/Attention_(machine_learning)) which used neurons that multiply the outputs of other neurons, so-called *multiplicative units*.\[13\] Neural networks using multiplicative units were later called *sigma-pi networks*\[14\] or *[higher-order networks](https://en.wikipedia.org/w/index.php?title=Higher-order_neural_network&action=edit&redlink=1)*.\[15\] LSTM became the standard architecture for long sequence modelling until the 2017 publication of transformers. However, LSTM still used sequential processing, like most other RNNs.\[note 2\] Specifically, RNNs operate one token at a time from first to last; they cannot operate in parallel over all tokens in a sequence.

Modern transformers overcome this problem, but unlike RNNs, they require computation time that is [quadratic](https://en.wikipedia.org/wiki/Quadratic_function) in the size of the context window. The linearly scaling [fast weight](https://en.wikipedia.org/w/index.php?title=Fast_weight&action=edit&redlink=1) controller (1992) learns to compute a weight matrix for further processing depending on the input.\[16\] One of its two networks has "fast weights" or "dynamic links" (1981).\[17\]\[18\]\[19\] A slow neural network learns by gradient descent to generate keys and values for computing the weight changes of the fast neural network which computes answers to queries.\[16\] This was later shown to be equivalent to the unnormalized linear transformer.\[20\]\[21\]

### Attention with seq2seq

\[[edit](https://en.wikipedia.org/w/index.php?title=Transformer_(deep_learning)&action=edit&section=T-2)\]

The idea of encoder–decoder sequence transduction had been developed in the early 2010s; commonly cited as the originators that produced seq2seq are two concurrently published papers from 2014.\[22\]\[23\]

A 380M-parameter model for machine translation uses two [long short-term memories](https://en.wikipedia.org/wiki/Long_short-term_memory) (LSTM).\[23\] Its architecture consists of two parts. The *encoder* is an LSTM that takes in a sequence of tokens and turns it into a vector. The *decoder* is another LSTM that converts the vector into a sequence of tokens. Similarly, another 130M-parameter model used [gated recurrent units](https://en.wikipedia.org/wiki/Gated_recurrent_unit) (GRU) instead of LSTM.\[22\] Later research showed that GRUs are neither better nor worse than LSTMs for seq2seq.\[24\]\[25\]

These early seq2seq models had no attention mechanism, and the state vector is accessible only after the *last* word of the source text was processed. Although in theory such a vector retains the information about the whole original sentence, in practice the information is poorly preserved. This is because the input is processed sequentially by one recurrent network into a *fixed*\-size output vector, which is then processed by another recurrent network into an output. If the input is long, then the output vector would not be able to contain all relevant information, degrading the output. As evidence, reversing the input sentence improved seq2seq translation.\[26\]

The *RNN search* model introduced an attention mechanism to seq2seq for machine translation to solve the bottleneck problem (of the *fixed-size* output vector), allowing the model to process long-distance dependencies more easily. The name is because it "emulates searching through a source sentence during decoding a translation".\[4\]

The relative performances were compared between global (that of *RNN search*) and local (sliding window) attention model architectures for machine translation, finding that mixed attention had higher quality than global attention, while local attention reduced translation time.\[27\]

In 2016, [Google Translate](https://en.wikipedia.org/wiki/Google_Translate) was revamped to [Google Neural Machine Translation](https://en.wikipedia.org/wiki/Google_Neural_Machine_Translation), which replaced the previous model based on [statistical machine translation](https://en.wikipedia.org/wiki/Statistical_machine_translation). The new model was a seq2seq model where the encoder and the decoder were both 8 layers of bidirectional LSTM.\[28\] It took nine months to develop, and it outperformed the statistical approach, which took ten years to develop.\[29\]

### Parallelizing attention

\[[edit](https://en.wikipedia.org/w/index.php?title=Transformer_(deep_learning)&action=edit&section=T-3)\]

Seq2seq models with attention (including self-attention) still suffered from the same issue with recurrent networks, which is that they are hard to [parallelize](https://en.wikipedia.org/wiki/Parallel_computing), which prevented them from being accelerated on GPUs. In 2016, *decomposable attention* applied a self-attention mechanism to [feedforward networks](https://en.wikipedia.org/wiki/Feedforward_neural_network), which are easy to parallelize, and achieved [SOTA](https://en.wikipedia.org/wiki/State_of_the_art) result in [textual entailment](https://en.wikipedia.org/wiki/Textual_entailment) with an order of magnitude fewer parameters than LSTMs.\[30\] One of its authors, Jakob Uszkoreit, suspected that attention *without* recurrence would be sufficient for language translation, thus the title "attention is *all* you need".\[31\] That hypothesis was against conventional wisdom at the time, and even his father [Hans Uszkoreit](https://en.wikipedia.org/wiki/Hans_Uszkoreit), a well-known computational linguist, was skeptical.\[31\] In the same year, self-attention (called *intra-attention or* *intra-sentence attention*) was proposed for LSTMs.\[32\]

In 2017, the original (100M-sized) encoder–decoder transformer model was proposed in the "[Attention is all you need](https://en.wikipedia.org/wiki/Attention_is_all_you_need)" paper. At the time, the focus of the research was on improving [seq2seq](https://en.wikipedia.org/wiki/Seq2seq) for [machine translation](https://en.wikipedia.org/wiki/Machine_translation), by removing its recurrence to process all tokens in parallel, but preserving its dot-product attention mechanism to keep its text processing performance.\[1\] This led to the introduction of a multi-head attention model that was easier to parallelize due to the use of independent heads and the lack of recurrence. Its parallelizability was an important factor to its widespread use in large neural networks.\[33\]

As early as spring 2017, even before the "Attention is all you need" preprint was published, one of the co-authors applied the "decoder-only" variation of the architecture to generate fictitious Wikipedia articles.\[34\] Transformer architecture is now used alongside many [generative models](https://en.wikipedia.org/wiki/Generative_artificial_intelligence) that contribute to the ongoing [AI boom](https://en.wikipedia.org/wiki/AI_boom).

In language modelling, [ELMo](https://en.wikipedia.org/wiki/ELMo) (2018) was a bi-directional LSTM that produces contextualized [word embeddings](https://en.wikipedia.org/wiki/Word_embedding), improving upon the line of research from [bag of words](https://en.wikipedia.org/wiki/Bag-of-words_model) and [word2vec](https://en.wikipedia.org/wiki/Word2vec). It was followed by [BERT](https://en.wikipedia.org/wiki/BERT_(language_model)) (2018), an encoder-only transformer model.\[35\] In October 2019, Google started using BERT to process search queries.\[36\] In 2020, Google Translate replaced the previous RNN-encoder–RNN-decoder model by a transformer-encoder–RNN-decoder model.\[37\]

Starting in 2018, the OpenAI [GPT series](https://en.wikipedia.org/wiki/Generative_pre-trained_transformer) of decoder-only transformers became state of the art in [natural language generation](https://en.wikipedia.org/wiki/Natural_language_generation). In 2022, a chatbot based on GPT-3, [ChatGPT](https://en.wikipedia.org/wiki/ChatGPT), became unexpectedly\[38\] popular, triggering a boom around [large language models](https://en.wikipedia.org/wiki/Large_language_model).\[39\]\[40\]

Since 2020, transformers have been applied in modalities beyond text, including the [vision transformer](https://en.wikipedia.org/wiki/Vision_transformer),\[41\] speech recognition,\[42\] robotics,\[43\] and [multimodal](https://en.wikipedia.org/wiki/Multimodal_learning).\[44\] The vision transformer, in turn, stimulated new developments in [convolutional neural networks](https://en.wikipedia.org/wiki/Convolutional_neural_network).\[45\] Image and video generators like [DALL-E](https://en.wikipedia.org/wiki/DALL-E) (2021), [Stable Diffusion 3](https://en.wikipedia.org/wiki/Stable_Diffusion) (2024),\[46\] and [Sora](https://en.wikipedia.org/wiki/Sora_(text-to-video_model)) (2024), use transformers to analyse input data (like text prompts) by breaking it down into "tokens" and then calculating the relevance between each token using self-attention, which helps the model understand the context and relationships within the data.

While the primary focus of the paper at the time was to improve machine translation, the paper also discussed the use of the architecture on English [Constituency Parsing](https://en.wikipedia.org/wiki/Constituent_(linguistics)), both with limited and large-sized datasets, achieving a high-score without specific tuning for the task indicating the promising nature of the model for use in a wide-variety of general purpose of seq2seq tasks.

**Dataset**

The English-to-German translation model was trained on the 2014 WMT (Workshop on Statistical Machine Translation) English-German dataset, consisting of nearly 4.5 million sentences derived from TED Talks and high-quality news articles. A separate translation model was trained on the much larger 2014 WMT English-French dataset, consisting of 36 million sentences. Both datasets were encoded with byte-pair encoding.

**Hardware**

The models were trained using 8 [NVIDIA P100 GPUs](https://en.wikipedia.org/wiki/Nvidia_Tesla). The base models were trained for 100,000 steps, and the big models were trained for 300,000 steps - each step taking about 0.4 seconds to complete for the base models and 1.0 seconds for the big models. The base model was trained for a total of 12 hours, and the big model was trained for a total of 3.5 days. Both the base and big models outperform the 2017 state-of-the-art in both English-German and English-French, while achieving the comparatively lowest training cost.\[1\] The estimated computing cost was 0.089 petaFLOP/s–days.\[47\]

**Hyperparameters and regularization**

For their 100M-parameter Transformer model, the authors increased the [learning rate](https://en.wikipedia.org/wiki/Learning_rate) linearly for the first 4000 (warmup) steps and decreased it proportionally to the inverse square root of the current step number. Dropout layers were applied to the output of each sub-layer before normalization, the sums of the embeddings, and the positional encodings. The dropout rate was set to 0.1. Label smoothing was applied with a value of 0.1, which "improves accuracy and BLEU score".\[1\]

- **^** [Gated recurrent units](https://en.wikipedia.org/wiki/Gated_recurrent_units) (2014) further reduced its complexity.- **^** Some architectures, such as RWKV or state space models, avoid the issue.

- ^ ***a*** ***b*** ***c*** ***d*** ***e*** ***f*** [Vaswani, Ashish](https://en.wikipedia.org/wiki/Ashish_Vaswani); [Shazeer, Noam](https://en.wikipedia.org/wiki/Noam_Shazeer); Parmar, Niki; Uszkoreit, Jakob; Jones, Llion; [Gomez, Aidan N](https://en.wikipedia.org/wiki/Aidan_Gomez); Kaiser, Łukasz; Polosukhin, Illia (December 2017). ["Attention is All you Need"](https://papers.nips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf) (PDF). In I. Guyon and U. Von Luxburg and S. Bengio and H. Wallach and R. Fergus and S. Vishwanathan and R. Garnett (ed.). *[31st Conference on Neural Information Processing Systems (NIPS)](https://en.wikipedia.org/wiki/Conference_on_Neural_Information_Processing_Systems)*. Advances in Neural Information Processing Systems. Vol. 30. Curran Associates, Inc. [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1706.03762](https://arxiv.org/abs/1706.03762).- **^** Love, Julia (10 July 2023). ["AI Researcher Who Helped Write Landmark Paper Is Leaving Google"](https://finance.yahoo.com/news/ai-researcher-helped-write-landmark-030025546.html). [Bloomberg News](https://en.wikipedia.org/wiki/Bloomberg_News). Retrieved 1 April 2024.- **^** Goldman, Sharon (20 March 2024). ["'Attention is All You Need' creators look beyond Transformers for AI at Nvidia GTC: 'The world needs something better'"](https://venturebeat.com/ai/attention-is-all-you-need-creators-look-beyond-transformers-at-nvidia-gtc-the-world-needs-something-better/). [VentureBeat](https://en.wikipedia.org/wiki/VentureBeat). Retrieved 1 April 2024.- ^ ***a*** ***b*** Bahdanau, Dzmitry; Cho, Kyunghyun; Bengio, Yoshua (19 May 2016). "Neural Machine Translation by Jointly Learning to Align and Translate". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1409.0473](https://arxiv.org/abs/1409.0473) \[[cs.CL](https://arxiv.org/archive/cs.CL)\].- **^** Shinde, Gitanjali; Wasatkar, Namrata; Mahalle, Parikshit (6 June 2024). [*Data-Centric Artificial Intelligence for Multidisciplinary Applications*](https://books.google.com/books?id=tqUIEQAAQBAJ&pg=PA75). [CRC Press](https://en.wikipedia.org/wiki/CRC_Press). p. 75. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [9781040031131](https://en.wikipedia.org/wiki/Special:BookSources/9781040031131).- **^** Toews, Rob (3 September 2023). ["Transformers Revolutionized AI. What Will Replace Them?"](https://www.forbes.com/sites/robtoews/2023/09/03/transformers-revolutionized-ai-what-will-replace-them/?sh=382f9f569c1f). *[Forbes](https://en.wikipedia.org/wiki/Forbes)*. [Archived](https://web.archive.org/web/20230926212003/https://www.forbes.com/sites/robtoews/2023/09/03/transformers-revolutionized-ai-what-will-replace-them/) from the original on 26 September 2023. Retrieved 3 December 2023.- **^** Murgia, Madhumita (23 July 2023). ["Transformers: the Google scientists who pioneered an AI revolution"](https://www.ft.com/content/37bb01af-ee46-4483-982f-ef3921436a50). *[Financial Times](https://en.wikipedia.org/wiki/Financial_Times)*. [Archived](https://archive.today/20231228061648/https://www.ft.com/content/37bb01af-ee46-4483-982f-ef3921436a50) from the original on 28 December 2023. Retrieved 22 March 2024.- ^ ***a*** ***b*** Marche, Stephen (23 August 2024). ["Was Linguistic A.I. Created by Accident?"](https://www.newyorker.com/science/annals-of-artificial-intelligence/was-linguistic-ai-created-by-accident). *The New Yorker*. [ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier)) [0028-792X](https://search.worldcat.org/issn/0028-792X). Retrieved 24 August 2024.- **^** Pearson, Helen; Ledford, Heidi; Hutson, Matthew; Van Noorden, Richard (15 April 2025). ["Exclusive: the most-cited papers of the twenty-first century"](https://www.nature.com/articles/d41586-025-01125-9). *[Nature](https://en.wikipedia.org/wiki/Nature_(journal))*. **640** (8059): 588–592\. [Bibcode](https://en.wikipedia.org/wiki/Bibcode_(identifier)):[2025Natur.640..588P](https://ui.adsabs.harvard.edu/abs/2025Natur.640..588P). [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1038/d41586-025-01125-9](https://doi.org/10.1038%2Fd41586-025-01125-9). [PMID](https://en.wikipedia.org/wiki/PMID_(identifier)) [40234577](https://pubmed.ncbi.nlm.nih.gov/40234577). Retrieved 18 April 2025.- **^** Murgia, Madhumita (23 July 2023). ["Transformers: the Google scientists who pioneered an AI revolution"](https://www.ft.com/content/37bb01af-ee46-4483-982f-ef3921436a50). *Financial Times*. Retrieved 22 March 2025.- **^** ["Meet the $4 Billion AI Superstars That Google Lost"](https://www.bloomberg.com/opinion/features/2023-07-13/ex-google-scientists-kickstarted-the-generative-ai-era-of-chatgpt-midjourney). *Bloomberg*. 13 July 2023 – via www.bloomberg.com.- ^ ***a*** ***b*** Levy, Steven. ["8 Google Employees Invented Modern AI. Here's the Inside Story"](https://www.wired.com/story/eight-google-employees-invented-modern-ai-transformers-paper/). *Wired*. [ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier)) [1059-1028](https://search.worldcat.org/issn/1059-1028). Retrieved 20 March 2024.- **^** Feldman, J. A.; Ballard, D. H. (1 July 1982). ["Connectionist models and their properties"](https://www.sciencedirect.com/science/article/pii/S0364021382800013). *Cognitive Science*. **6** (3): 205–254\. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1016/S0364-0213(82)80001-3](https://doi.org/10.1016%2FS0364-0213%2882%2980001-3). [ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier)) [0364-0213](https://search.worldcat.org/issn/0364-0213).- **^** Rumelhart, David E.; McClelland, James L.; Hinton, Geoffrey E. (29 July 1987). [*Parallel Distributed Processing, Volume 1: Explorations in the Microstructure of Cognition: Foundations, Chapter 2*](https://stanford.edu/~jlmcc/papers/PDP/Chapter2.pdf) (PDF). Cambridge, Mass: Bradford Books. [ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier)) [978-0-262-68053-0](https://en.wikipedia.org/wiki/Special:BookSources/978-0-262-68053-0).- **^** Giles, C. Lee; Maxwell, Tom (1 December 1987). ["Learning, invariance, and generalization in high-order neural networks"](https://opg.optica.org/abstract.cfm?URI=ao-26-23-4972). *Applied Optics*. **26** (23): 4972–4978\. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1364/AO.26.004972](https://doi.org/10.1364%2FAO.26.004972). [ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier)) [0003-6935](https://search.worldcat.org/issn/0003-6935). [PMID](https://en.wikipedia.org/wiki/PMID_(identifier)) [20523475](https://pubmed.ncbi.nlm.nih.gov/20523475).- ^ ***a*** ***b*** [Schmidhuber, Jürgen](https://en.wikipedia.org/wiki/J%C3%BCrgen_Schmidhuber) (1992). ["Learning to control fast-weight memories: an alternative to recurrent nets"](https://archive.org/download/wikipedia-scholarly-sources-corpus/10.1162.zip/10.1162%252Fneco.1992.4.1.131.pdf) (PDF). *Neural Computation*. **4** (1): 131–139\. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1162/neco.1992.4.1.131](https://doi.org/10.1162%2Fneco.1992.4.1.131). [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [16683347](https://api.semanticscholar.org/CorpusID:16683347).- **^** Christoph von der Malsburg: The correlation theory of brain function. Internal Report 81-2, MPI Biophysical Chemistry, 1981. [http://cogprints.org/1380/1/vdM\_correlation.pdf](http://cogprints.org/1380/1/vdM_correlation.pdf) See Reprint in Models of Neural Networks II, chapter 2, pages 95–119. Springer, Berlin, 1994.- **^** Jerome A. Feldman, "Dynamic connections in neural networks," Biological Cybernetics, vol. 46, no. 1, pp. 27–39, Dec. 1982.- **^** Hinton, Geoffrey E.; Plaut, David C. (1987). ["Using Fast Weights to Deblur Old Memories"](https://escholarship.org/uc/item/0570j1dp). *Proceedings of the Annual Meeting of the Cognitive Science Society*. **9**.- **^** Katharopoulos, Angelos; Vyas, Apoorv; Pappas, Nikolaos; Fleuret, François (2020). ["Transformers are RNNs: Fast autoregressive Transformers with linear attention"](https://proceedings.mlr.press/v119/katharopoulos20a.html). *ICML 2020*. PMLR. pp. 5156–5165.- **^** Schlag, Imanol; Irie, Kazuki; [Schmidhuber, Jürgen](https://en.wikipedia.org/wiki/Juergen_Schmidhuber) (2021). "Linear Transformers Are Secretly Fast Weight Programmers". *ICML 2021*. Springer. pp. 9355–9366.- ^ ***a*** ***b*** Cho, Kyunghyun; van Merriënboer, Bart; Gulcehre, Caglar; Bahdanau, Dzmitry; Bougares, Fethi; Schwenk, Holger; Bengio, Yoshua (October 2014). ["Learning Phrase Representations using RNN Encoder–Decoder for Statistical Machine Translation"](https://aclanthology.org/D14-1179). In Moschitti, Alessandro; Pang, Bo; Daelemans, Walter (eds.). *Proceedings of the 2014 Conference on Empirical Methods in Natural Language Processing (EMNLP)*. Doha, Qatar: Association for Computational Linguistics. pp. 1724–1734\. [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1406.1078](https://arxiv.org/abs/1406.1078). [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.3115/v1/D14-1179](https://doi.org/10.3115%2Fv1%2FD14-1179).- ^ ***a*** ***b*** Sutskever, Ilya; Vinyals, Oriol; Le, Quoc Viet (14 December 2014). "Sequence to sequence learning with neural networks". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1409.3215](https://arxiv.org/abs/1409.3215) \[[cs.CL](https://arxiv.org/archive/cs.CL)\]. \[first version posted to arXiv on 10 Sep 2014\]- **^** Chung, Junyoung; Gulcehre, Caglar; Cho, KyungHyun; Bengio, Yoshua (2014). "Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1412.3555](https://arxiv.org/abs/1412.3555) \[[cs.NE](https://arxiv.org/archive/cs.NE)\].- **^** Gruber, N.; Jockisch, A. (2020), "Are GRU cells more specific and LSTM cells more sensitive in motive classification of text?", *Frontiers in Artificial Intelligence*, **3** 40, [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.3389/frai.2020.00040](https://doi.org/10.3389%2Ffrai.2020.00040), [PMC](https://en.wikipedia.org/wiki/PMC_(identifier)) [7861254](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7861254), [PMID](https://en.wikipedia.org/wiki/PMID_(identifier)) [33733157](https://pubmed.ncbi.nlm.nih.gov/33733157), [S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier)) [220252321](https://api.semanticscholar.org/CorpusID:220252321)- **^** Sutskever, Ilya; Vinyals, Oriol; Le, Quoc V (2014). ["Sequence to Sequence Learning with Neural Networks"](https://proceedings.neurips.cc/paper/2014/hash/a14ac55a4f27472c5d894ec1c3c743d2-Abstract.html). *Advances in Neural Information Processing Systems*. **27**. Curran Associates, Inc. [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1409.3215](https://arxiv.org/abs/1409.3215).- **^** Luong, Minh-Thang; Pham, Hieu; Manning, Christopher D. (2015). "Effective Approaches to Attention-based Neural Machine Translation". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1508.04025](https://arxiv.org/abs/1508.04025) \[[cs.CL](https://arxiv.org/archive/cs.CL)\].- **^** Wu, Yonghui; et al. (1 September 2016). "Google's Neural Machine Translation System: Bridging the Gap between Human and Machine Translation". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1609.08144](https://arxiv.org/abs/1609.08144) \[[cs.CL](https://arxiv.org/archive/cs.CL)\].- **^** Lewis-Kraus, Gideon (14 December 2016). ["The Great A.I. Awakening"](https://web.archive.org/web/20230524052626/https://www.nytimes.com/2016/12/14/magazine/the-great-ai-awakening.html). *The New York Times*. [ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier)) [0362-4331](https://search.worldcat.org/issn/0362-4331). Archived from [the original](https://www.nytimes.com/2016/12/14/magazine/the-great-ai-awakening.html) on 24 May 2023. Retrieved 22 June 2023.- **^** Parikh, Ankur P.; Täckström, Oscar; Das, Dipanjan; Uszkoreit, Jakob (25 September 2016). "A Decomposable Attention Model for Natural Language Inference". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1606.01933](https://arxiv.org/abs/1606.01933) \[[cs.CL](https://arxiv.org/archive/cs.CL)\].- ^ ***a*** ***b*** Levy, Steven. ["8 Google Employees Invented Modern AI. Here's the Inside Story"](https://www.wired.com/story/eight-google-employees-invented-modern-ai-transformers-paper/). *Wired*. [ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier)) [1059-1028](https://search.worldcat.org/issn/1059-1028). [Archived](https://web.archive.org/web/20240320101528/https://www.wired.com/story/eight-google-employees-invented-modern-ai-transformers-paper/) from the original on 20 March 2024. Retrieved 6 August 2024.- **^** Cheng, Jianpeng; Dong, Li; Lapata, Mirella (November 2016). ["Long Short-Term Memory-Networks for Machine Reading"](https://aclanthology.org/D16-1053/). In Su, Jian; Duh, Kevin; Carreras, Xavier (eds.). *Proceedings of the 2016 Conference on Empirical Methods in Natural Language Processing*. Austin, Texas: Association for Computational Linguistics. pp. 551–561\. [doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.18653/v1/D16-1053](https://doi.org/10.18653%2Fv1%2FD16-1053).- **^** Peng, Bo; Alcaide, Eric; Anthony, Quentin; Albalak, Alon; Arcadinho, Samuel; Biderman, Stella; Cao, Huanqi; Cheng, Xin; Chung, Michael (10 December 2023), *RWKV: Reinventing RNNs for the transformer Era*, [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[2305.13048](https://arxiv.org/abs/2305.13048)- **^** Marche, Stephen (23 August 2024). ["Was Linguistic A.I. Created by Accident?"](https://www.newyorker.com/science/annals-of-artificial-intelligence/was-linguistic-ai-created-by-accident). *The New Yorker*. [ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier)) [0028-792X](https://search.worldcat.org/issn/0028-792X). Retrieved 27 August 2024.- **^** Devlin, Jacob; Chang, Ming-Wei; Lee, Kenton; Toutanova, Kristina (11 October 2018). "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1810.04805v2](https://arxiv.org/abs/1810.04805v2) \[[cs.CL](https://arxiv.org/archive/cs.CL)\].- **^** ["Google: BERT now used on almost every English query"](https://searchengineland.com/google-bert-used-on-almost-every-english-query-342193). *Search Engine Land*. 15 October 2020. Retrieved 24 November 2020.- **^** Caswell, Isaac; Liang, Bowen (8 June 2020). ["Recent Advances in Google Translate"](https://research.google/blog/recent-advances-in-google-translate/). *Google Research*. [Archived](https://web.archive.org/web/20240704042433/https://research.google/blog/recent-advances-in-google-translate/) from the original on 4 July 2024. Retrieved 7 August 2024.- **^** ["The inside story of how ChatGPT was built from the people who made it"](https://www.technologyreview.com/2023/03/03/1069311/inside-story-oral-history-how-chatgpt-built-openai/). *MIT Technology Review*. Retrieved 6 August 2024.- **^** ["Improving language understanding with unsupervised learning"](https://openai.com/research/language-unsupervised). *openai.com*. 11 June 2018. [Archived](https://web.archive.org/web/20230318210736/https://openai.com/research/language-unsupervised) from the original on 18 March 2023. Retrieved 18 March 2023.- **^** [*finetune-transformer-lm*](https://github.com/openai/finetune-transformer-lm), OpenAI, 11 June 2018, retrieved 1 May 2023- **^** Dosovitskiy, Alexey; Beyer, Lucas; Kolesnikov, Alexander; Weissenborn, Dirk; Zhai, Xiaohua; Unterthiner, Thomas; Dehghani, Mostafa; Minderer, Matthias; Heigold, Georg; Gelly, Sylvain; Uszkoreit, Jakob (3 June 2021). "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[2010.11929](https://arxiv.org/abs/2010.11929) \[[cs.CV](https://arxiv.org/archive/cs.CV)\].- **^** Gulati, Anmol; Qin, James; Chiu, Chung-Cheng; Parmar, Niki; Zhang, Yu; Yu, Jiahui; Han, Wei; Wang, Shibo; Zhang, Zhengdong; Wu, Yonghui; Pang, Ruoming (2020). "Conformer: Convolution-augmented Transformer for Speech Recognition". [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[2005.08100](https://arxiv.org/abs/2005.08100) \[[eess.AS](https://arxiv.org/archive/eess.AS)\].- **^** Chen, Lili; Lu, Kevin; Rajeswaran, Aravind; Lee, Kimin; Grover, Aditya; Laskin, Michael; Abbeel, Pieter; Srinivas, Aravind; Mordatch, Igor (24 June 2021), *Decision Transformer: Reinforcement Learning via Sequence Modeling*, [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[2106.01345](https://arxiv.org/abs/2106.01345)- **^** Choromanski, Krzysztof; Likhosherstov, Valerii; Dohan, David; Song, Xingyou; Gane, Andreea; Sarlos, Tamas; Hawkins, Peter; Davis, Jared; Mohiuddin, Afroz (19 November 2022), *Rethinking Attention with Performers*, [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[2009.14794](https://arxiv.org/abs/2009.14794)- **^** Liu, Zhuang; Mao, Hanzi; Wu, Chao-Yuan; Feichtenhofer, Christoph; Darrell, Trevor; Xie, Saining (2022). [*A ConvNet for the 2020s*](https://openaccess.thecvf.com/content/CVPR2022/html/Liu_A_ConvNet_for_the_2020s_CVPR_2022_paper.html). Conference on Computer Vision and Pattern Recognition ([CVPR](https://en.wikipedia.org/wiki/CVPR)). pp. 11976–11986.- **^** Esser, Patrick; Kulal, Sumith; Blattmann, Andreas; Entezari, Rahim; Müller, Jonas; Saini, Harry; Levi, Yam; Lorenz, Dominik; Sauer, Axel (5 March 2024), *Scaling Rectified Flow Transformers for High-Resolution Image Synthesis*, [arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[2403.03206](https://arxiv.org/abs/2403.03206)- **^** ["AI and compute"](https://openai.com/index/ai-and-compute/). *openai.com*. 9 June 2022. Retrieved 29 April 2025.

- ["Attention Is All You Need"](https://research.google/pubs/attention-is-all-you-need/)on [Google Research](https://en.wikipedia.org/wiki/Google_Research)
- ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762)on [arXiv](https://en.wikipedia.org/wiki/ArXiv)- Uszkoreit, Jakob (31 August 2017). ["Transformer: A Novel Neural Network Architecture for Language Understanding"](https://research.google/blog/transformer-a-novel-neural-network-architecture-for-language-understanding/). *research.google*. Retrieved 9 August 2024.A concurrent blog post on the Google Research blog.

---

## Wikipedia:Contents - Wikipedia

> Source: https://en.wikipedia.org/wiki/Wikipedia:Contents
> Tokens: ~2 394

- (Top)- 1 Browse by subject
 - 1.1 Culture and the arts- 1.2 Geography and places- 1.3 Health and fitness- 1.4 History and events- 1.5 Human activities- 1.6 Mathematics and logic- 1.7 Natural and physical sciences- 1.8 People and self- 1.9 Philosophy and thinking- 1.10 Reference works- 1.11 Religion and belief systems- 1.12 Society and social sciences- 1.13 Technology and applied sciences- 2 Browse by format
 - 2.1 Overviews- 2.2 Outlines- 2.3 Lists- 2.4 Portals- 2.5 Glossaries- 2.6 Category system- 3 Articles by quality
 - 3.1 Vital articles- 3.2 List of articles every Wikipedia should have- 3.3 Featured content- 3.4 Good content- 4 Spoken articles- 5 Alphabetical lists of articles- 6 Topics- 7 Types- 8 Places, people and times- 9 Indices

[![Page semi-protected](https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Semi-protection-shackle.svg/20px-Semi-protection-shackle.svg.png)](https://en.wikipedia.org/wiki/Wikipedia:Protection_policy#semi)

From Wikipedia, the free encyclopedia

Contents

- [Overviews](https://en.wikipedia.org/wiki/Wikipedia:Contents/Overviews)
- [Outlines](https://en.wikipedia.org/wiki/Wikipedia:Contents/Outlines)
- [Lists](https://en.wikipedia.org/wiki/Wikipedia:Contents/Lists)
- [Portals](https://en.wikipedia.org/wiki/Wikipedia:Contents/Portals)
- [Glossaries](https://en.wikipedia.org/wiki/Wikipedia:Contents/Glossaries)
- [Categories](https://en.wikipedia.org/wiki/Wikipedia:Contents/Categories)
- [Vital articles](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles)
- [Featured content](https://en.wikipedia.org/wiki/Wikipedia:Featured_content)
- [Good content](https://en.wikipedia.org/wiki/Wikipedia:Good_content)
- [Indices](https://en.wikipedia.org/wiki/Wikipedia:Contents/Indices)
- [Index](https://en.wikipedia.org/wiki/Wikipedia:Contents/A%E2%80%93Z_index)

- [Reference](https://en.wikipedia.org/wiki/Wikipedia:Contents/Reference)
- [Culture](https://en.wikipedia.org/wiki/Wikipedia:Contents/Culture_and_the_arts)
- [Geography](https://en.wikipedia.org/wiki/Wikipedia:Contents/Geography_and_places)
- [Health](https://en.wikipedia.org/wiki/Wikipedia:Contents/Health_and_fitness)
- [History](https://en.wikipedia.org/wiki/Wikipedia:Contents/History_and_events)
- [Human activities](https://en.wikipedia.org/wiki/Wikipedia:Contents/Human_activities)
- [Mathematics](https://en.wikipedia.org/wiki/Wikipedia:Contents/Mathematics_and_logic)
- [Nature](https://en.wikipedia.org/wiki/Wikipedia:Contents/Natural_and_physical_sciences)
- [People](https://en.wikipedia.org/wiki/Wikipedia:Contents/People_and_self)
- [Philosophy](https://en.wikipedia.org/wiki/Wikipedia:Contents/Philosophy_and_thinking)
- [Religion](https://en.wikipedia.org/wiki/Wikipedia:Contents/Religion_and_belief_systems)
- [Society](https://en.wikipedia.org/wiki/Wikipedia:Contents/Society_and_social_sciences)
- [Technology](https://en.wikipedia.org/wiki/Wikipedia:Contents/Technology_and_applied_sciences)

- [WP:EXPLORE](https://en.wikipedia.org/w/index.php?title=Wikipedia:EXPLORE&redirect=no)

Easily explore [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia) using the topic links below. You can also search directly using the search bar. All section headers are clickable for quick navigation.

## Browse by subject

Wikipedia's content is divided into broad subject areas:

### Culture and the arts

- [Culture and the arts](https://en.wikipedia.org/wiki/Wikipedia:Contents/Culture_and_the_arts)

### Geography and places

- [Geography and places](https://en.wikipedia.org/wiki/Wikipedia:Contents/Geography_and_places)

### Health and fitness

- [Health and fitness](https://en.wikipedia.org/wiki/Wikipedia:Contents/Health_and_fitness)

### History and events

- [History and events](https://en.wikipedia.org/wiki/Wikipedia:Contents/History_and_events)
 - [List of timelines](https://en.wikipedia.org/wiki/List_of_timelines)
- [2026](https://en.wikipedia.org/wiki/2026)– Major events this year- [2026 in science](https://en.wikipedia.org/wiki/2026_in_science)– Ongoing science findings and technology advancements- [Portal:Current events](https://en.wikipedia.org/wiki/Portal:Current_events)– Featured current events and related project activities

### Human activities

- [Human activities](https://en.wikipedia.org/wiki/Wikipedia:Contents/Human_activities)

### Mathematics and logic

- [Mathematics and logic](https://en.wikipedia.org/wiki/Wikipedia:Contents/Mathematics_and_logic)

### Natural and physical sciences

- [Natural and physical sciences](https://en.wikipedia.org/wiki/Wikipedia:Contents/Natural_and_physical_sciences)

### People and self

- [People and self](https://en.wikipedia.org/wiki/Wikipedia:Contents/People_and_self)

### Philosophy and thinking

- [Philosophy and thinking](https://en.wikipedia.org/wiki/Wikipedia:Contents/Philosophy_and_thinking)

### Reference works

- [Reference works](https://en.wikipedia.org/wiki/Wikipedia:Contents/Reference)
 - [Library of Congress Classification](https://en.wikipedia.org/wiki/Library_of_Congress_Classification)
- [List of Dewey Decimal classes](https://en.wikipedia.org/wiki/List_of_Dewey_Decimal_classes)
- [Figurative system of human knowledge](https://en.wikipedia.org/wiki/Figurative_system_of_human_knowledge)( *[Encyclopédie](https://en.wikipedia.org/wiki/Encyclop%C3%A9die)*)- *[Propædia](https://en.wikipedia.org/wiki/Prop%C3%A6dia)*( *[Encyclopædia Britannica](https://en.wikipedia.org/wiki/Encyclop%C3%A6dia_Britannica)*)- [Tree of knowledge system](https://en.wikipedia.org/wiki/Tree_of_knowledge_system)
- [UDC outline](https://en.wikipedia.org/wiki/Universal_Decimal_Classification#Outline)
- [Wikipedia:List of bibliographies](https://en.wikipedia.org/wiki/Wikipedia:List_of_bibliographies)
- [Category:Wikipedia bibliographies](https://en.wikipedia.org/wiki/Category:Wikipedia_bibliographies)

### Religion and belief systems

- [Religion and belief systems](https://en.wikipedia.org/wiki/Wikipedia:Contents/Religion_and_belief_systems)

### Society and social sciences

- [Society and social sciences](https://en.wikipedia.org/wiki/Wikipedia:Contents/Society_and_social_sciences)

### Technology and applied sciences

- [Technology and applied sciences](https://en.wikipedia.org/wiki/Wikipedia:Contents/Technology_and_applied_sciences)

## Browse by format

### Overviews

- [Overviews](https://en.wikipedia.org/wiki/Wikipedia:Contents/Overviews)

### Outlines

- [Outlines](https://en.wikipedia.org/wiki/Wikipedia:Contents/Outlines)

### Lists

- [Lists](https://en.wikipedia.org/wiki/Wikipedia:Contents/Lists)

### Portals

- [Portals](https://en.wikipedia.org/wiki/Wikipedia:Contents/Portals)

### Glossaries

- [Glossaries](https://en.wikipedia.org/wiki/Wikipedia:Contents/Glossaries)

### Category system

- [Category:Main topic classifications](https://en.wikipedia.org/wiki/Category:Main_topic_classifications)– Arts, History, Technology, and more- [Wikipedia:Contents/Categories](https://en.wikipedia.org/wiki/Wikipedia:Contents/Categories)– Hand-crafted list of topic categories- [Category:People](https://en.wikipedia.org/wiki/Category:People)– Biographies

## Articles by quality

### Vital articles

*Lists of articles deemed most essential for the encyclopedia.*

- [Vital articles](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles)
 - [Level 1](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/1)– 10 articles- [Level 2](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/2)– 100 articles- [Level 3](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/3)– 1,000 articles- [Level 4](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/4)– 10,000 articles- [Level 5](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/5)– 50,000 articles

### List of articles every Wikipedia should have

*Similar to vital articles, but for every language.*

- [List of articles every Wikipedia should have](https://en.wikipedia.org/wiki/Wikipedia:List_of_articles_every_Wikipedia_should_have)
 - [List of articles every Wikipedia should have/Expanded](https://en.wikipedia.org/wiki/Wikipedia:List_of_articles_every_Wikipedia_should_have/Expanded)

### Featured content

*Contributions representing the best of Wikipedia, having undergone a rigorous review process by multiple independent editors.*

- [Featured content](https://en.wikipedia.org/wiki/Wikipedia:Featured_content)
 - [Featured articles](https://en.wikipedia.org/wiki/Wikipedia:Featured_articles)
- [Featured lists](https://en.wikipedia.org/wiki/Wikipedia:Featured_lists)
- [Featured pictures](https://en.wikipedia.org/wiki/Wikipedia:Featured_pictures)
- [Featured topics](https://en.wikipedia.org/wiki/Wikipedia:Featured_topics)

### Good content

*Quality contributions that meet a core set of editorial standards, having undergone a thorough review by an independent editor.*

- [Good articles](https://en.wikipedia.org/wiki/Wikipedia:Good_articles)
- [Good topics](https://en.wikipedia.org/wiki/Wikipedia:Good_topics)

## Spoken articles

- [Category:Spoken articles](https://en.wikipedia.org/wiki/Category:Spoken_articles)
- [Wikipedia:Spoken articles](https://en.wikipedia.org/wiki/Wikipedia:Spoken_articles)

## Alphabetical lists of articles

- [Special:Allpages](https://en.wikipedia.org/wiki/Special:AllPages)– List of all current pages- [Wikipedia:Contents/A–Z index](https://en.wikipedia.org/wiki/Wikipedia:Contents/A%E2%80%93Z_index)– Alphabetical index- [Category:Wikipedia indexes](https://en.wikipedia.org/wiki/Category:Wikipedia_indexes)– Alphabetical list of topic indexes- [Wikipedia:Contents/Indices](https://en.wikipedia.org/wiki/Wikipedia:Contents/Indices)– Indexes sorted by topic area

---

## Main Page

> Source: https://en.wikipedia.org/wiki/Main_Page
> Tokens: ~3 758

From Wikipedia, the free encyclopedia

## From today's featured article

[![Ice-filled summit crater of Mount Edziza](https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Edziza042909--_113-16.jpg/250px-Edziza042909--_113-16.jpg)](https://en.wikipedia.org/wiki/File:Edziza042909--_113-16.jpg)

Ice-filled summit crater of Mount Edziza

**[Mount Edziza](https://en.wikipedia.org/wiki/Mount_Edziza)** is a volcanic mountain in [Cassiar Land District](https://en.wikipedia.org/wiki/Cassiar_Land_District) in northwestern [British Columbia](https://en.wikipedia.org/wiki/British_Columbia), Canada. It is located on the [Big Raven Plateau](https://en.wikipedia.org/wiki/Big_Raven_Plateau) of the [Tahltan Highland](https://en.wikipedia.org/wiki/Tahltan_Highland), which extends along the western side of the [Stikine Plateau](https://en.wikipedia.org/wiki/Stikine_Plateau). Mount Edziza has an elevation of 2,786 metres (9,140 feet), making it the highest point of the [Mount Edziza volcanic complex](https://en.wikipedia.org/wiki/Mount_Edziza_volcanic_complex) and one of the highest volcanoes in Canada. However, it had an elevation of at least 3,396 m (11,142 ft) before its formerly cone-shaped summit was likely destroyed by a violent eruption in the geologic past; its current flat summit contains an ice-filled [crater](https://en.wikipedia.org/wiki/Volcanic_crater) *(pictured)* 2 kilometres (1.2 miles) in diameter. Mount Edziza contains several [lava domes](https://en.wikipedia.org/wiki/Lava_dome), [cinder cones](https://en.wikipedia.org/wiki/Cinder_cone) and [lava fields](https://en.wikipedia.org/wiki/Lava_field) on its flanks, as well as an [ice cap](https://en.wikipedia.org/wiki/Ice_cap) containing several [outlet glaciers](https://en.wikipedia.org/wiki/Glacier_morphology#Outlet_glaciers) that extend to lower elevations. All sides of the mountain are drained by [tributaries](https://en.wikipedia.org/wiki/Tributary) of [Mess Creek](https://en.wikipedia.org/wiki/Mess_Creek) and [Kakiddi Creek](https://en.wikipedia.org/wiki/Kakiddi_Creek), which are situated within the [Stikine River](https://en.wikipedia.org/wiki/Stikine_River) watershed. *(**[Full article...](https://en.wikipedia.org/wiki/Mount_Edziza)**)*

## Did you know ...

[![Girardinus metallicus](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Girardinus_metallicus_%28metal_girardinus%29_%28cropped%29.jpg/250px-Girardinus_metallicus_%28metal_girardinus%29_%28cropped%29.jpg)](https://en.wikipedia.org/wiki/File:Girardinus_metallicus_(metal_girardinus)_(cropped).jpg)

*Girardinus metallicus*

- ... that Cuba's ***[Girardinus](https://en.wikipedia.org/wiki/Girardinus)***fish *(pictured)*may have evolved into different species because the island's rivers are often interrupted by waterfalls or vanish underground?- ... that Tinashe's ***[333](https://en.wikipedia.org/wiki/333_(Tinashe_album))***and Wishy's ***[Triple Seven](https://en.wikipedia.org/wiki/Triple_Seven_(album))***are both named for angel numbers?- ... that **[slipper lamps](https://en.wikipedia.org/wiki/Slipper_lamp)**produced in the [Umayyad](https://en.wikipedia.org/wiki/Umayyad_Caliphate)era sometimes carried bilingual inscriptions with "The [Light of Christ](https://en.wikipedia.org/wiki/Light_of_Christ)shines for all" in Greek, alongside "God" ( [Allah](https://en.wikipedia.org/wiki/Allah)) in Arabic?- ... that **[Anahit Ananyan](https://en.wikipedia.org/wiki/Anahit_Ananyan)**was credited with starting Armenia's tomato heritage?- ... that the relocation of **[a Mexico City monument](https://en.wikipedia.org/wiki/Monument_to_Enrico_Mart%C3%ADnez)**resulted in the water-level indicators on its pedestal losing their original geographic alignment?- ... that a pre-order ticket campaign for ***[Rhapsody in August](https://en.wikipedia.org/wiki/Rhapsody_in_August)***saw ¥300of the ¥1,300ticket price go to the assistance of birds affected by the [Gulf War](https://en.wikipedia.org/wiki/Gulf_War)?- ... that **[Allan Ludwig](https://en.wikipedia.org/wiki/Allan_Ludwig)**is known as a "Founding Father" of gravestone studies?- ... that during the 1939 **[Abbeville Conference](https://en.wikipedia.org/wiki/Abbeville_Conference)**, the first meeting of the [Anglo-French Supreme War Council](https://en.wikipedia.org/wiki/Anglo-French_Supreme_War_Council), the parties agreed not to launch large-scale operations against Germany?- ... that **[Haruka No. 2](https://en.wikipedia.org/wiki/Haruka_No._2)**plays two [recorders](https://en.wikipedia.org/wiki/Recorder_(musical_instrument))using her nose, one with each nostril?

## In the news

[![Tô Lâm in 2025](https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Keir_Starmer_meets_T%C3%B4_L%C3%A2m_29-10-2025_%286%29_%28cropped%29.jpg/250px-Keir_Starmer_meets_T%C3%B4_L%C3%A2m_29-10-2025_%286%29_%28cropped%29.jpg)](https://en.wikipedia.org/wiki/File:Keir_Starmer_meets_T%C3%B4_L%C3%A2m_29-10-2025_(6)_(cropped).jpg)

Tô Lâm

- **[A series of attacks](https://en.wikipedia.org/wiki/2026_Balochistan_attacks)**by the [Balochistan Liberation Army](https://en.wikipedia.org/wiki/Balochistan_Liberation_Army)and resulting counter-operations leaves more than 190 people dead in several districts of [Balochistan](https://en.wikipedia.org/wiki/Balochistan,_Pakistan), Pakistan.- **[A winter storm](https://en.wikipedia.org/wiki/January_23%E2%80%9327,_2026_North_American_winter_storm)**causes widespread damage across North America and leaves more than 140 people dead.- Vietnam's **[communist party congress](https://en.wikipedia.org/wiki/14th_National_Congress_of_the_Communist_Party_of_Vietnam)**re-elects [Tô Lâm](https://en.wikipedia.org/wiki/T%C3%B4_L%C3%A2m) *(pictured)*as [general secretary](https://en.wikipedia.org/wiki/General_Secretary_of_the_Communist_Party_of_Vietnam), the most powerful position in the [one-party state](https://en.wikipedia.org/wiki/One-party_state).- **[Iliana Iotova](https://en.wikipedia.org/wiki/Iliana_Iotova)**becomes the first female [president of Bulgaria](https://en.wikipedia.org/wiki/President_of_Bulgaria)following the resignation of [Rumen Radev](https://en.wikipedia.org/wiki/Rumen_Radev).

## On this day

**[February 2](https://en.wikipedia.org/wiki/February_2)**

[![Excerpt of the Breviary of Alaric](https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Munich%2C_Ms_BSB_Clm_22501_fol._71v-72r_-_Breviary_of_Alaric_excerpt.jpg/250px-Munich%2C_Ms_BSB_Clm_22501_fol._71v-72r_-_Breviary_of_Alaric_excerpt.jpg)](https://en.wikipedia.org/wiki/File:Munich,_Ms_BSB_Clm_22501_fol._71v-72r_-_Breviary_of_Alaric_excerpt.jpg)

Excerpt of the Breviary of Alaric

- [506](https://en.wikipedia.org/wiki/506)– [Alaric II](https://en.wikipedia.org/wiki/Alaric_II), [King of the Visigoths](https://en.wikipedia.org/wiki/Visigothic_Kingdom), promulgated a collection of [Roman law](https://en.wikipedia.org/wiki/Roman_law)known as the ***[Breviary of Alaric](https://en.wikipedia.org/wiki/Breviary_of_Alaric)*** *(excerpt pictured)*.- [1438](https://en.wikipedia.org/wiki/1438)– Nine leaders of the **[Transylvanian peasant revolt](https://en.wikipedia.org/wiki/Transylvanian_peasant_revolt)**were executed in [Torda](https://en.wikipedia.org/wiki/Turda).- [1659](https://en.wikipedia.org/wiki/1659)– [Jan van Riebeeck](https://en.wikipedia.org/wiki/Jan_van_Riebeeck), the founder of [Cape Town](https://en.wikipedia.org/wiki/Cape_Town), produced the first bottle of **[South African wine](https://en.wikipedia.org/wiki/South_African_wine)**.- [1963](https://en.wikipedia.org/wiki/1963)– [Cold War in Asia](https://en.wikipedia.org/wiki/Cold_War_in_Asia): 113 alleged communists were **[arrested and detained without trial](https://en.wikipedia.org/wiki/Operation_Coldstore)**by [Singapore's security agencies](https://en.wikipedia.org/wiki/Internal_Security_Department_(Singapore)).- [2009](https://en.wikipedia.org/wiki/2009)– **[Omid](https://en.wikipedia.org/wiki/Omid)**, Iran's first domestically made [satellite](https://en.wikipedia.org/wiki/Satellite), was launched from [Semnan Space Center](https://en.wikipedia.org/wiki/Semnan_Space_Center).

- **[Piotr Skarga](https://en.wikipedia.org/wiki/Piotr_Skarga)**( b.1536)- **[Alix Le Clerc](https://en.wikipedia.org/wiki/Alix_Le_Clerc)**( b.1576)- **[Vincenzo Dimech](https://en.wikipedia.org/wiki/Vincenzo_Dimech)**( d.1831)- **[Abu Salman Shahjahanpuri](https://en.wikipedia.org/wiki/Abu_Salman_Shahjahanpuri)**( d.2021)

## From today's featured list

## Today's featured picture

## Other areas of Wikipedia

- **[Community portal](https://en.wikipedia.org/wiki/Wikipedia:Community_portal)**– The central hub for editors, with resources, links, tasks, and announcements.- **[Village pump](https://en.wikipedia.org/wiki/Wikipedia:Village_pump)**– Forum for discussions about Wikipedia itself, including policies and technical issues.- **[Site news](https://en.wikipedia.org/wiki/Wikipedia:News)**– Sources of news about Wikipedia and the broader Wikimedia movement.- **[Teahouse](https://en.wikipedia.org/wiki/Wikipedia:Teahouse)**– Ask basic questions about using or editing Wikipedia.- **[Help desk](https://en.wikipedia.org/wiki/Wikipedia:Help_desk)**– Ask questions about using or editing Wikipedia.- **[Reference desk](https://en.wikipedia.org/wiki/Wikipedia:Reference_desk)**– Ask research questions about encyclopedic topics.- **[Content portals](https://en.wikipedia.org/wiki/Wikipedia:Contents/Portals)**– A unique way to navigate the encyclopedia.

## Wikipedia's sister projects

Wikipedia is written by volunteer editors and hosted by the [Wikimedia Foundation](https://en.wikipedia.org/wiki/Wikimedia_Foundation), a non-profit organization that also hosts a range of other volunteer [projects](https://wikimediafoundation.org/our-work/wikimedia-projects/):

- [![Commons logo](https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/40px-Commons-logo.svg.png)](https://commons.wikimedia.org/wiki/)
- [![MediaWiki logo](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/MediaWiki-2020-icon.svg/40px-MediaWiki-2020-icon.svg.png)](https://www.mediawiki.org/wiki/)
- [![Meta-Wiki logo](https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Wikimedia_Community_Logo.svg/40px-Wikimedia_Community_Logo.svg.png)](https://meta.wikimedia.org/wiki/) [Meta-Wiki](https://meta.wikimedia.org/wiki/)
Wikimedia project coordination- [![Wikibooks logo](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Wikibooks-logo.svg/40px-Wikibooks-logo.svg.png)](https://en.wikibooks.org/wiki/)
- [![Wikidata logo](https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Wikidata-logo.svg/60px-Wikidata-logo.svg.png)](https://www.wikidata.org/wiki/)
- [![Wikinews logo](https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Wikinews-logo.svg/60px-Wikinews-logo.svg.png)](https://en.wikinews.org/wiki/)
- [![Wikiquote logo](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Wikiquote-logo.svg/40px-Wikiquote-logo.svg.png)](https://en.wikiquote.org/wiki/)
- [![Wikisource logo](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Wikisource-logo.svg/40px-Wikisource-logo.svg.png)](https://en.wikisource.org/wiki/)
- [![Wikispecies logo](https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Wikispecies-logo.svg/40px-Wikispecies-logo.svg.png)](https://species.wikimedia.org/wiki/)
- [![Wikiversity logo](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Wikiversity_logo_2017.svg/60px-Wikiversity_logo_2017.svg.png)](https://en.wikiversity.org/wiki/)
- [![Wikivoyage logo](https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wikivoyage-Logo-v3-icon.svg/40px-Wikivoyage-Logo-v3-icon.svg.png)](https://en.wikivoyage.org/wiki/)
- [![Wiktionary logo](https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Wiktionary-logo-v2.svg/40px-Wiktionary-logo-v2.svg.png)](https://en.wiktionary.org/wiki/)[![Wiktionary logo](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wiktionary-logo.svg/60px-Wiktionary-logo.svg.png)](https://en.wiktionary.org/wiki/)

## Wikipedia languages

This Wikipedia is written in [English](https://en.wikipedia.org/wiki/English_language). Many [other Wikipedias are available](https://meta.wikimedia.org/wiki/List_of_Wikipedias); some of the largest are listed below.

- - [العربية](https://ar.wikipedia.org/wiki/)
- [Deutsch](https://de.wikipedia.org/wiki/)
- [Español](https://es.wikipedia.org/wiki/)
- [فارسی](https://fa.wikipedia.org/wiki/)‎- [Français](https://fr.wikipedia.org/wiki/)
- [Italiano](https://it.wikipedia.org/wiki/)
- [Nederlands](https://nl.wikipedia.org/wiki/)
- [日本語](https://ja.wikipedia.org/wiki/)
- [Polski](https://pl.wikipedia.org/wiki/)
- [Português](https://pt.wikipedia.org/wiki/)
- [Русский](https://ru.wikipedia.org/wiki/)
- [Svenska](https://sv.wikipedia.org/wiki/)
- [Українська](https://uk.wikipedia.org/wiki/)
- [Tiếng Việt](https://vi.wikipedia.org/wiki/)
- [中文](https://zh.wikipedia.org/wiki/)- - [Bahasa Indonesia](https://id.wikipedia.org/wiki/)
- [Bahasa Melayu](https://ms.wikipedia.org/wiki/)
- [Bân-lâm-gú](https://zh-min-nan.wikipedia.org/wiki/)
- [Български](https://bg.wikipedia.org/wiki/)
- [Català](https://ca.wikipedia.org/wiki/)
- [Čeština](https://cs.wikipedia.org/wiki/)
- [Dansk](https://da.wikipedia.org/wiki/)
- [Eesti](https://et.wikipedia.org/wiki/)
- [Ελληνικά](https://el.wikipedia.org/wiki/)
- [Esperanto](https://eo.wikipedia.org/wiki/)
- [Euskara](https://eu.wikipedia.org/wiki/)
- [עברית](https://he.wikipedia.org/wiki/)
- [Հայերեն](https://hy.wikipedia.org/wiki/)
- [한국어](https://ko.wikipedia.org/wiki/)
- [Magyar](https://hu.wikipedia.org/wiki/)
- [Norsk bokmål](https://no.wikipedia.org/wiki/)
- [Română](https://ro.wikipedia.org/wiki/)
- [Simple English](https://simple.wikipedia.org/wiki/)
- [Slovenčina](https://sk.wikipedia.org/wiki/)
- [Srpski](https://sr.wikipedia.org/wiki/)
- [Srpskohrvatski](https://sh.wikipedia.org/wiki/)
- [Suomi](https://fi.wikipedia.org/wiki/)
- [Türkçe](https://tr.wikipedia.org/wiki/)
- [Oʻzbekcha](https://uz.wikipedia.org/wiki/)- - [Asturianu](https://ast.wikipedia.org/wiki/)
- [Azərbaycanca](https://az.wikipedia.org/wiki/)
- [বাংলা](https://bn.wikipedia.org/wiki/)
- [Bosanski](https://bs.wikipedia.org/wiki/)
- [کوردی](https://ckb.wikipedia.org/wiki/)
- [Frysk](https://fy.wikipedia.org/wiki/)
- [Gaeilge](https://ga.wikipedia.org/wiki/)
- [Galego](https://gl.wikipedia.org/wiki/)
- [Hrvatski](https://hr.wikipedia.org/wiki/)
- [ქართული](https://ka.wikipedia.org/wiki/)
- [Kurdî](https://ku.wikipedia.org/wiki/)
- [Latviešu](https://lv.wikipedia.org/wiki/)
- [Lietuvių](https://lt.wikipedia.org/wiki/)
- [മലയാളം](https://ml.wikipedia.org/wiki/)
- [Македонски](https://mk.wikipedia.org/wiki/)
- [မြန်မာဘာသာ](https://my.wikipedia.org/wiki/)
- [Norsk nynorsk](https://nn.wikipedia.org/wiki/)
- [ਪੰਜਾਬੀ](https://pa.wikipedia.org/wiki/)
- [Shqip](https://sq.wikipedia.org/wiki/)
- [Slovenščina](https://sl.wikipedia.org/wiki/)
- [ไทย](https://th.wikipedia.org/wiki/)
- [తెలుగు](https://te.wikipedia.org/wiki/)
- [اردو](https://ur.wikipedia.org/wiki/)