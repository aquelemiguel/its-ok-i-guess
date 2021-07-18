<script lang="ts">
	import * as _ from 'lodash';
	import * as db from '../models/reviews.json';

	type App = {
		appid: number;
		name: string;
		reviews: string[];
	};

	const getRandomApps = (n: number): App[] => {
		return _.sampleSize(Object.values(db['default']), n);
	}

	const getRandomReview = (app: App) : string => {
		// const regex = new RegExp(app.name, 'gi');
		// const spoiler = [...Array(Math.floor(Math.random() * (20 - 10 + 1)) + 10)].map(x => '*').join('');
		// return _.sample(app.reviews).replaceAll(regex, `<span class="spoiler">${spoiler}</span>`);

		return _.sample(app.reviews);
	}

	const onGuess = (guess: App) => {
		if (guess.appid === correct.appid) {
			score++;
			new Audio('sfx/correct.mp3').play();
		}
		else {
			score = 0;
			new Audio('sfx/wrong.mp3').play();
		}

		apps = getRandomApps(3);
		correct = _.sample(apps);
	}

	let score = 0;
	let apps: App[] = getRandomApps(3);
	let correct: App = _.sample(apps);
</script>

<main>
	<h1>it's ok, i guess</h1>
	<h4>Guess from which game the Steam review came from!</h4>

	<div class="score-container">
		<div class="score-bubble">
			{ score }
		</div>
	</div>

	<div class="choice-container">
		{#each apps as app}
			<div class="choice" on:click={() => onGuess(app)}>
				<img src="banners/{app.appid}_header.jpg" alt="" />
				<span>{ app.name }</span>
			</div>
		{/each}
	</div>

	<div class="review-container">
		<span class="big-quotation-mark">“</span>
		<span class="review-body">{ @html getRandomReview(correct) }</span>
	</div>

	<div class="actions">
		<a href="https://github.com/aquelemiguel/its-ok-i-guess">
			<img width="35px" src="icons/github.png" alt="GitHub logo" />
		</a>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		text-align: center;
		max-width: 1200px;
		margin: 0 auto;
		height: 100%;
	}

	h1 {
		font-size: 5em;
		font-weight: 900;
		margin: 1.25em 0 0 0;
	}

	h4 {
		font-weight: normal;
		margin-top: 0.5em;
		margin-bottom: 4em;
		color: #ffffff4f;
	}

	.score-container {
		display: flex;
		justify-content: center;
	}

	.score-bubble {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 75px;
		height: 75px;
		background: whitesmoke;
		border-radius: 50%;
		font-size: 32px;
		mix-blend-mode: screen;
		color: black;
	}

	.choice-container {
		display: flex;
		justify-content: space-around;
		margin: 1.5em 0 1em 0;
	}

	.choice {
		display: flex;
		flex-direction: column;
		font-family: '';
		width: 400px;
		height: 225px;
		background: #ffffff0f;
		border-radius: 10px;
		overflow: hidden;
		transition: all .2s ease;
		cursor: pointer;
	}

	.choice:first-child {
		margin-right: 1em;
	}

	.choice:last-child {
		margin-left: 1em;
	}

	.choice:hover {
		background: whitesmoke;
		color: #1f2126;
	}

	.choice > img {
		max-width: 100%;
		max-height: 100%;
	}

	.choice > span {
		display: flex;
		font-family: 'Motiva Sans Bold';
		align-items: center;
		justify-content: center;
		flex-grow: 1;
	}

	.review-container {
		display: flex;
		flex-direction: column;
		text-align: left;
		width: 100%;
		height: 200px;
	}

	.big-quotation-mark {
		font-size: 108px;
		height: 40px;
		color: #ffffff49;
	}

	.review-body {
		font-family: 'Motiva Sans Bold';
		margin: 0 15em 2.5em 2.5em;
		font-size: 24px;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.actions img {
		filter: opacity(50%);
	}
</style>