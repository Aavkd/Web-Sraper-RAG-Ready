# Extracted Content from dev.to

**Source:** https://dev.to/
**Crawled:** 2026-02-02T06:01:43.668Z
**Pages:** 5 extracted, 5 skipped
**Tokens:** ~6 432 estimated
**Duration:** 16s

---

## Table of Contents

1. [DEV Community](#dev-community)
2. [Understanding AI Model (LLM) Parameters: A Chef's Guide](#understanding-ai-model-llm-parameters-a-chefs-guid)
3. [The 66% Problem](#the-66-problem)
4. [Join the GitHub Copilot CLI Challenge! Win GitHub Universe Tickets, Copilot Pro+ Subscriptions and $1,000 in Cash 💸](#join-the-github-copilot-cli-challenge-win-github-u)
5. [ELi5 : AI Workflows vs AI Agents, Explained with LEGOs](#eli5-ai-workflows-vs-ai-agents-explained-with-lego)

---

## DEV Community

> Source: https://dev.to/
> Tokens: ~53

## Join the GitHub Copilot CLI Challenge! Win GitHub Universe Tickets, Copilot Pro+ Subscriptions and $1,000 in Cash 💸

### Jess Lee for The DEV Team ・ Jan 22

#githubchallenge #devchallenge #cli #githubcopilot

---

## Understanding AI Model (LLM) Parameters: A Chef's Guide

> Source: https://dev.to/sreeni5018/understanding-ai-model-llm-parameters-a-chefs-guide-4469
> Tokens: ~2 407

## What Are AI Model Parameters? Let Me Explain

My friend asked me yesterday, "What does it mean when they say GPT-4 has 1.7 trillion parameters? What even are parameters?"

Great question! I realized a lot of people hear these huge numbers 175 billion, 1.7 trillion and have no idea what they actually represent. So let me explain it the way I explained it to my friend, using something we both understand: cooking.

## Let's Start With What We Know

When you hear about AI models, you'll see numbers like:

- GPT-3 has 175 billion parameters- GPT-4 has around 1.7 trillion parameters- Claude 3.5 Sonnet has roughly 400 billion parameters

These numbers are huge. But what do they mean? Are they **storing** that many **facts**? That many **sentences**? Let me break it down.

## Think About a Chef

Imagine you're learning to **cook**. You start with **recipes**, **ingredients**, and **lots** of **practice**. Over time, you don't just follow recipes anymore you *understand* cooking. You know when to add more **salt**, how long to cook something, which **spices** work together.

AI models work the same way.

### The Raw Ingredients = Training Data

When we train an AI model, we feed it massive amounts of **text** books, **websites**, **conversations**, **code**, **articles**. Think of this as the raw ingredients. Just having flour, **spices**, and **vegetables** doesn't make you a good cook. You need to learn how to use them.

### The Chef's Skill = Parameters

Here's where parameters come in.

Parameters are **not** the training data. They're what the model **learned** from that data. Think of them as the chef's skill, experience, and intuition.

When a chef cooks biryani 1,000 times, they learn:

- Exactly how much salt balances the rice- When to add the spices for maximum flavour- How long to cook it based on the heat- How to adjust if something goes wrong

**They didn't memorize 1,000 biryani recipes**. They developed an *understanding* of how biryani works. That understanding those **tiny** **adjustments** and **decisions** stored in their mind that's what parameters are in AI.

## How Does the Learning Actually Happen?

This is the most important part that many explanations skip.

Imagine a student chef learning to make biryani. Here's what happens:

**Step 1:** They cook the biryani (using their current knowledge)

**Step 2:** The master chef tastes it and says, "Too much salt" or "Not enough spice"

**Step 3:** The student adjusts their technique maybe they use half a teaspoon less salt next time, or add cardamom earlier

**Step 4:** They cook again with these adjustments

**Step 5:** Repeat this thousands of times

After 1,000 attempts, the student doesn't need the master chef anymore. They've internalized the patterns. They *know* instinctively how to make great biryani.

### This Is Exactly How AI Training Works

The AI model reads billions of sentences from its training data. For each sentence, it:

- **Tries to predict the next word**— "The cat sat on the ___"- **Checks if it was right**— the actual word was "mat"- **Adjusts its internal numbers (parameters)**to make better predictions next time- **Repeats this billions of times**across all the text

Through this process, the model isn't memorizing sentences. It's learning patterns:

- Grammar rules (subjects come before verbs)- Word relationships (cats sit, birds fly)- Context (a river "bank" vs. a money "bank")- Reasoning patterns (cause and effect)

By the end of training, those 1.7 trillion parameters contain all these learned patterns. They're like the compressed wisdom the model gained from reading all that text.

## So What Does "1.7 Trillion Parameters" Actually Mean?

When we say GPT-4 has 1.7 trillion parameters, we're saying it has 1.7 trillion tiny adjustable numbers that store all this learned knowledge.

Each parameter is like a single tiny piece of knowledge:

- "When this word appears, slightly increase the chance of that word coming next"- "In this context, this phrase structure is more likely"- "These concepts are related in this way"

More parameters = more capacity to store subtle patterns and nuances. It's why larger models can often understand context better and give more sophisticated responses.

But here's the key: **more parameters doesn't mean more facts memorized**. It means more ability to understand the *patterns* in language.

## When You Ask ChatGPT a Question

Now when you type a question into ChatGPT, here's what happens:

You're like a customer ordering food. The AI chef doesn't look up your exact question in a database. Instead, it uses all those 1.7 trillion learned patterns (parameters) to generate a fresh response, right there on the spot.

That's why it can answer questions it has never seen before. Just like a skilled chef can create a new dish without having the exact recipe, the AI can create new answers using the patterns it learned.

## Why Smaller Models Can Still Be Good

You might wonder: if more parameters are better, why do we have smaller models?

Think about it this way. You don't need a Michelin star chef to make good everyday food. Sometimes a home cook with good fundamentals can make an excellent meal.

Newer models like GPT-4o (around 200 billion parameters) are designed smarter. They might have fewer parameters, but they're organized more efficiently. They can still perform really well for most tasks while being:

- Faster to respond- Cheaper to run- Easier to use on different devices

## The Simple Truth

So when someone asks you what AI parameters are, tell them this:

**Parameters are the learned knowledge stored inside the AI model. They're created through billions of training examples, where the model keeps adjusting itself to make better predictions. They're not memorized facts they're patterns and relationships the model discovered in language.**

It's like the difference between someone who memorized a cookbook and a chef who understands *why* ingredients work together. The AI has 1.7 trillion tiny pieces of understanding that help it generate intelligent responses to questions it has never seen before.

That's it. That's what parameters are.

## But Wait What About RAG and Fine-tuning?

Now here's where it gets even more interesting. My friend then asked, "But what about when people talk about **RAG** or **fine-tuning**? How does that fit in?"

Great question! Let me extend our cooking analogy.

### LLMs Are Like Frozen Food

Think of a trained LLM (like GPT-4 or Claude) as high quality frozen food. It's already prepared, cooked, and ready. The chef (the company that trained it) has already done the hard work. All those parameters? They're frozen locked in place.

But you can still make it better or customize it for your needs. Here are two ways:

### RAG (Retrieval Augmented Generation) = Adding Fresh Ingredients

Imagine you have frozen biryani. It's good, but you want to make it your own. So you:

- Heat it up- Add fresh coriander on top- Mix in some raita- Maybe add extra fried onions

You didn't change the frozen biryani itself. You just added fresh ingredients around it to make it better and more customized.

**This is exactly what RAG does.**

When you use **RAG**, you're not changing the AI's parameters (the frozen food stays frozen). Instead, you're giving it fresh, relevant information right when it needs it:

- You ask: "What did our company discuss in last week's meeting?"- RAG system searches your company documents- It finds the meeting notes- It gives those notes to the AI along with your question- The AI uses its frozen knowledge (parameters) + the fresh information (meeting notes) to answer

The base model stays the same, but you've enhanced it with up-to-date, specific information. Just like adding fresh ingredients to frozen food.

### Fine-tuning = Making a New Dish From Frozen Food

Now imagine something different. You take that frozen biryani and decide to completely remake it:

- You add paneer and make it paneer biryani- Or add extra vegetables and spices to create a completely new flavour profile- You're essentially creating a new dish using the frozen food as a base

**This is fine-tuning.**

When you **fine tune** an AI model, you're actually **unfreezing some of those parameters** and training them again on your specific data:

- You start with the base model ( **frozen food**)- You train it on your specific examples (adding new ingredients and cooking it differently)- The parameters adjust to your specific use case- You end up with a **customized**model

For example, a hospital might fine tune GPT-4 on medical records to create a specialized medical AI. The base knowledge is still there (language patterns, reasoning), but now it's been adjusted to understand medical terminology and patterns better.

### The Key Difference

**RAG** = Keep the model frozen, just add fresh information when needed

- Fast to set up- No need to retrain anything- Perfect for adding new, changing information

**Fine-tuning** = Unfreeze and adjust the model itself

- Takes more time and resources- Changes the actual parameters- Perfect for specialized tasks or domain specific knowledge

**Both approaches use the same idea**: the pre trained model (with its trillions of parameters) is your starting point your frozen food. But depending on what you need, you either add fresh ingredients around it (**RAG**) or transform it into something new (**fine tuning**).

*Note: The exact parameter counts for newer models are often estimates, as companies don't always publish official numbers. But the concept remains the same parameters represent the learned patterns, not the raw data.*

**Thanks
Sreeni Ramadorai**

---

## The 66% Problem

> Source: https://dev.to/evanlausier/the-66-problem-1c3m
> Tokens: ~1 436

[![Cover image for The 66% Problem](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftq2abfta1rmznnlwz84e.jpeg)](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftq2abfta1rmznnlwz84e.jpeg)

I spent three hours last Tuesday chasing a bug that didn't exist.

The code looked perfect. It was syntactically correct, followed best practices, and even had thoughtful comments explaining what each function did. The problem was that one of those functions was solving a problem I never asked it to solve. Claude had decided, in its infinite pattern-matching wisdom, that my API endpoint needed pagination. I hadn't asked for pagination. I didn't want pagination. But there it was, breaking my response structure in ways that took me longer to diagnose than it would have taken to write the whole thing myself.

This is the 66% problem.

According to Stack Overflow's latest developer survey of over 90,000 developers, 66% said their biggest frustration with AI coding assistants is that the code is "almost right, but not quite." Another 45% said debugging AI-generated code takes more work than it's worth.

I find those numbers oddly comforting. Not because I enjoy suffering, but because it means I'm not losing my mind. The tools that were supposed to make me faster have introduced a new category of bug that didn't exist three years ago: the bug that looks like working code.

Here's the thing about completely wrong code. It fails loudly. It throws errors. It refuses to compile. Your test suite catches it. You fix it and move on with your life. But almost-right code? That's the code that passes your tests, ships to staging, and then does something subtly insane at 2am when your biggest client runs a batch job you forgot they were running.

The old bugs were honest. They announced themselves. These new bugs are polite. They wait.

I've been writing code professionally for decades... I've made every mistake you can make. I've shipped SQL injection vulnerabilities. I've accidentally deleted production data. I once re-imaged over a production database locking myself out.Those were my mistakes, and I understood them immediately when they blew up. The feedback loop was tight: I did something dumb, the system complained, I learned not to do that again.

The AI-generated bugs don't work that way. When something breaks now, my first question isn't "what did I do wrong?" It's "what did the AI do that I didn't notice?" That's a fundamentally different kind of debugging. Instead of understanding my own logic, I'm reverse-engineering someone else's assumptions about what I probably wanted.

Microsoft Research published a study earlier this year that quantified this. They tested nine different AI models on SWE-bench Lite, a benchmark of 300 real-world debugging tasks. The best performer, Claude 3.7 Sonnet, solved 48.4% of them. Less than half. These weren't exotic edge cases. They were the kinds of bugs that wouldn't trip up an experienced developer.

The models are phenomenal at writing code. They struggle to fix it.

This makes a perverse kind of sense when you think about how they work. Code generation is pattern completion. You give the model a prompt, it predicts what code probably comes next based on billions of examples. That's genuinely useful for boilerplate, for syntax you've forgotten, for exploring unfamiliar libraries. But debugging isn't pattern completion. Debugging is hypothesis testing. It requires understanding what the code is supposed to do, what it's actually doing, and why those two things are different.

That "why" is where everything falls apart. The AI doesn't know why your system is architected the way it is. It doesn't know about the business rule your CEO insisted on in 2019 that makes no logical sense but accounts for 40% of your revenue. It doesn't know that your database schema has a quirk because you migrated from Oracle fifteen years ago and nobody wants to touch it. It just sees patterns and matches them.

The METR randomized trial from July 2025 found something that should concern all of us. They had experienced open-source developers complete tasks with and without AI assistance. The AI group was 19% slower on average. But here's the part that keeps me up at night: they believed they were 24% faster. Before starting, participants predicted AI would speed them up. After finishing, even with slower results, they still thought it had helped.

We're not just getting almost-right code. We're getting almost-right code while feeling productive. The dopamine hit of instant completion masks the debugging debt accumulating behind us.

I'm not going to tell you to stop using AI tools. I use them constantly. But I've started treating them differently than I did a year ago. I used to accept suggestions and move on. Now I read every line like it was written by a junior developer who's very confident and moderately competent. Because that's essentially what it is.

The 66% aren't complaining because the tools are bad. They're complaining because the tools are good enough to be dangerous. A hammer that misses the nail is annoying. A hammer that hits almost the right spot is how you end up with a crooked house.

I don't have a solution. I'm not sure anyone does yet. The tools will get better. The context windows will get longer. The models will learn to ask clarifying questions instead of assuming. Maybe.

Until then, I'm keeping my print statements close and my test coverage closer. Some skills don't need to be automated. They need to be sharpened.

---

## Join the GitHub Copilot CLI Challenge! Win GitHub Universe Tickets, Copilot Pro+ Subscriptions and $1,000 in Cash 💸

> Source: https://dev.to/devteam/join-the-github-copilot-cli-challenge-win-github-universe-tickets-copilot-pro-subscriptions-and-50af
> Tokens: ~1 245

[![Cover image for Join the GitHub Copilot CLI Challenge! Win GitHub Universe Tickets, Copilot Pro+ Subscriptions and $1,000 in Cash 💸](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6kv3h80vr00d635c9jwi.png)](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6kv3h80vr00d635c9jwi.png)

We're excited to announce our newest challenge with [GitHub](https://github.com/)!

Running through **February 15**, the [GitHub Copilot CLI Challenge](https://dev.to/challenges/github-2026-01-21) invites you to experience the power of GitHub Copilot directly in your terminal.

GitHub Copilot CLI brings AI-powered coding assistance to your command line, enabling you to build, debug, and understand code through natural language conversations.

Whether you're building productivity tools, fun experiments, or solving everyday problems, this challenge is the perfect opportunity to explore what's possible when AI meets the command line.

We have some really great prizes for this challenge, and there are many opportunities to win! Read on to learn more.

## Our Prompt

**Your mandate is to build an application using GitHub Copilot CLI.**
What should you build? That's entirely up to you! Here are some ideas to get you started:

- **Productivity boosters:**Tools that make your daily workflow smoother- **Fun experiments:**That silly idea you've always wanted an excuse to build- **Problem solvers:**Solutions to common pain points you or others face- **Creative utilities:**Unique tools that showcase what Copilot CLI can do

The most important aspect? Show us how GitHub Copilot CLI enhances your development process and helps you build something awesome.

## Prizes

**Three Winners** will each receive:

- $1,000 USD- Ticket to GitHub Universe 2026 (October 28-29)- Exclusive DEV Badge

**25 Runner-Ups** will each receive:

- 1-year GitHub Copilot Pro+ subscription- Exclusive DEV Badge

**All Participants** with a valid submission will receive a completion badge on their DEV profile.

### Getting Started with GitHub Copilot CLI 🚀

Ready to dive in? Check out the GitHub Copilot CLI repository:

## ![GitHub logo](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fassets.dev.to%2Fassets%2Fgithub-logo-5a155e1f9a670af7944dd5e12375bc76ed542ea80224905ecaf878b9157cdefc.svg) [github](https://github.com/github) / [copilot-cli](https://github.com/github/copilot-cli)

### GitHub Copilot CLI brings the power of Copilot coding agent directly to your terminal.

## GitHub Copilot CLI (Public Preview)

The power of GitHub Copilot, now in your terminal.

GitHub Copilot CLI brings AI-powered coding assistance directly to your command line, enabling you to build, debug, and understand code through natural language conversations. Powered by the same agentic harness as GitHub's Copilot coding agent, it provides intelligent assistance while staying deeply integrated with your GitHub workflow.

See [our official documentation](https://docs.github.com/copilot/concepts/agents/about-copilot-cli) for more information.

[[Image: Image of the splash screen for the Copilot CLI]](https://private-user-images.githubusercontent.com/1682753/538962279-f40aa23d-09dd-499e-9457-1d57d3368887.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjkxMjE3OTQsIm5iZiI6MTc2OTEyMTQ5NCwicGF0aCI6Ii8xNjgyNzUzLzUzODk2MjI3OS1mNDBhYTIzZC0wOWRkLTQ5OWUtOTQ1Ny0xZDU3ZDMzNjg4ODcucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI2MDEyMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjAxMjJUMjIzODE0WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9NjliM2IxZWFhNmVlN2RkYjk4MmJmYzFjODQ3ZTNmNzIzOGMxOWI0MzMyMzI2ZjljMzZiNTQyNDRkZTRlMGM0YyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.WVVMVgwBvsEcv-Ib-5fWyy8C0oE4_KAfmP9NvKw4p8I)

## 🚀 Introduction and Overview

We're bringing the power of GitHub Copilot coding agent directly to your terminal. With GitHub Copilot CLI, you can work locally and synchronously with an AI agent that understands your code and GitHub context.

- **Terminal-native development:**Work with Copilot coding agent directly in your command line — no context switching required.- **GitHub integration out of the box:**Access your repositories, issues, and pull requests using natural language, all authenticated with your existing GitHub account.- **Agentic capabilities:**Build, edit…

## Important Dates

- January 22: GitHub Copilot CLI Challenge begins!- February 15: Submissions due at 11:59 PM PST- February 26: Winners Announced

We can't wait to see what you build with GitHub Copilot CLI! Questions about the challenge? Ask them below.

Good luck and happy coding!

---

## ELi5 : AI Workflows vs AI Agents, Explained with LEGOs

> Source: https://dev.to/shlokaguptaa/ai-workflows-vs-ai-agents-explained-with-legos-581g
> Tokens: ~1 291

Ever dumped a pile of LEGOs on the floor?

Yes?

Well then, you are already a step closer to understanding the difference between AI workflows and AI agents.

### AI workflows: LEGO manual builds

An AI workflow is like opening a LEGO house kit and following the instruction manual from step 1 to step 12.

You know:

- exactly which piece snaps where- the order of the steps- and what the final house will look like

Nothing is left to chance.

AI workflows work the same way. They follow a *fixed control path*, a predefined sequence of steps.

But why do we even need workflows in the first place?

#### Why Models Alone Aren’t Enough

Models are really good at tasks like drafting emails, writing text messages, generating blog content, creating images, onverting text to voice, and other stuff

For example, if I ask an LLM:

*“Hey, can you draft me a text to ask Sam out on a date?”*
An LLM (based application) like ChatGPT or Gemini will do a great job...

...but sometimes, they kinda suck!

Say, I ask chat:
"When is my date with Sam?"
It won’t have a clue.

But what makes LLMs/Models kinda suck sometimes?

While, it's true that they have been trained on massive public datasets, they don’t have access to your personal or proprietary data. Stuff like your calendar, emails, company’s internal documents, etc.

So what’s the solution?
Give the model access to your data.(Not all of it. Be careful. Duh!)

Now, when the LLM gets questions around time like:
*“When is my date with Sam?”*
OR
*"When is my lunch?"*
OR
*"When is my meeting?"*

it will:

- Query your calendar- Extract the relevant event- Summarize it- Respond to you

That’s an AI workflow!

Note that over here the model is NOT deciding what to do, it’s following a pre-wired path:
Input → Retrieve → Process → Respond

Just like a LEGO manual, the logic and path is fixed!

#### What makes workflows awesome

AI workflows are awesome because of:

- Predictable behavior- Easy to reason about- Cheap and efficient (Like really cost friendly)- Same input → same output

You have a ballpark figure of how many “pieces” (API calls, LLM calls, compute) it will take.

#### The downside

If you didn’t plan for a step, the system breaks.

Just like realizing mid-build that the manual requires a rare LEGO piece you lost under the couch. Everything stops until a human fixes it. :/

Say, in the AI workflow above, you ask:
“What should I wear for my date, given the weather?”

The workflow will fail! Not because the question is hard, but because:

- it doesn’t have access to a weather API- it doesn’t know how to fetch outfits- it wasn’t designed for this path

Sure, you can fix this by adding a weather API, adding an image generation model, wiring everything together

But no matter how many modules you add, it’s **still just a workflow**.

It is still a fixed, predefined path.

No matter how many extra tools you glue on, the workflow still can’t decide to change the plan. When you need the system to rethink the plan itself, you don’t need more steps, you need something with a goal and autonomy. That’s where agents come in.

### AI Agents: Free Builds With a Goal

An AI agent is like dumping a pile of LEGOs in front of a kid and saying:

“Build me something I can live in."

You don’t give the kid instructions. You give them a *goal*.

The kid then:

- inspects the available pieces- decides to build a house- realizes they’re missing roof tiles- pivots to a cabin… or a cave

They reason their way to the goal using whatever resources they have.

Similarly, with agents, you don’t give the Model a pre defined path, you give:

- a **goal**- a **set of tools**(APIs, vector databases, workflows, search)- permission to decide what to do next

When you give models tools, a goal, and permission to decide what to do next, that’s when they start acting like agents.

In a workflow, you decide this once at design time. In an agent, the LLM decides this at runtime.

But the awesomeness of agents comes at a cost

Every decision , “Should I search the web?” , “Should I call this API?”, “Do I need another refinement loop?” is another LLM reasoning step.

Think of it like hiring a brilliant architect:

- incredible ideas- lots of sketches- very expensive

Agents rarely crash outright. instead, they might give you something technically valid but very wrong.

Like a LEGO jail, when all you wanted was a small cabin.

#### So When Should You Use Which?

If you need certainty and repeatability, workflows are your friend.
You know exactly what pieces exist, exactly how they fit together, and exactly how the system behaves. Basically, when you need a factory.

If you need adaptability in messy environments, agents make sense.
They can reason around missing pieces, try alternative approaches, and still deliver something when the path isn’t clear.

But the most practical pattern is hybrid.

- Let workflows handle the predictable assembly line- Drop agents into the steps that truly need flexible reasoning

This approach is called, Agentic Workflows, and it’s how most real-world AI systems are being built today.

Manual where possible. Free build where necessary. Just like LEGOs.

* * *

Rolling Credits:

- YouTube videos- LLMs- Reddit