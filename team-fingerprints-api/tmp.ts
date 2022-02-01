// async getAvgResultForAllCompanies(surveyId: string) {
//   return await this.countPoints(surveyId, 'companies', '');
//   // const schema = [];

//   // const survey = await this.surveyModel.findById({ _id: surveyId });
//   // if (!survey) return new InternalServerErrorException();
//   // survey.categories.map((category: any) => {
//   //   category.trends.forEach((trend: any) => {
//   //     schema.push({
//   //       category: category._id.toString(),
//   //       categoryTitle: category.title,
//   //       trend: trend._id.toString(),
//   //       trendPrimary: trend.primary,
//   //       trendSecondary: trend.secondary,
//   //     });
//   //   });
//   // });

//   // const companies = await this.companyService.getCompaneis();

//   // const companiesResult: any = await Promise.all(
//   //   companies.map(async (company: any) => {
//   //     return await this.getAvgResultForCompany(
//   //       surveyId,
//   //       company._id.toString(),
//   //     );
//   //   }),
//   // );

//   // const companiesResultFlat = [];
//   // for (const res of companiesResult) {
//   //   companiesResultFlat.push(res);
//   // }

//   // const surveyResult = {};

//   // schema.forEach((obj) => {
//   //   const avgTrends = [];

//   //   let trendCount = 0;
//   //   let counter = 0;
//   //   companiesResultFlat.forEach((surveyAnswer) => {
//   //     if (surveyAnswer[obj.category]) {
//   //       surveyAnswer[obj.category].avgTrends.forEach((avgTrend) => {
//   //         if (obj.trend === avgTrend.trendId) {
//   //           if (avgTrend.avgTrendAnswer) {
//   //             trendCount += avgTrend.avgTrendAnswer;
//   //             counter++;
//   //           }
//   //         }
//   //       });
//   //     }
//   //   });

//   //   avgTrends.push({
//   //     trendId: obj.trend,
//   //     trendPrimary: obj.trendPrimary,
//   //     trendSecondary: obj.trendSecondary,
//   //     avgTrendAnswer: trendCount / counter,
//   //   });

//   //   if (surveyResult[obj.category]) {
//   //     surveyResult[obj.category] = {
//   //       categoryTitle: obj.categoryTitle,
//   //       categoryId: obj.category,
//   //       avgTrends: [...avgTrends, ...surveyResult[obj.category].avgTrends],
//   //     };
//   //   } else {
//   //     surveyResult[obj.category] = {
//   //       categoryTitle: obj.categoryTitle,
//   //       categoryId: obj.category,
//   //       avgTrends,
//   //     };
//   //   }
//   // });

//   // return surveyResult;
// }

// async getAvgResultForCompany(surveyId: string, companyId: string) {
//   return await this.countPoints(surveyId, 'company', companyId);
//   // const schema = [];

//   // const survey = await this.surveyModel.findById({ _id: surveyId });
//   // if (!survey) return new InternalServerErrorException();
//   // survey.categories.map((category: any) => {
//   //   category.trends.forEach((trend: any) => {
//   //     schema.push({
//   //       category: category._id.toString(),
//   //       categoryTitle: category.title,
//   //       trend: trend._id.toString(),
//   //       trendPrimary: trend.primary,
//   //       trendSecondary: trend.secondary,
//   //     });
//   //   });
//   // });

//   // const { teams } = await this.companyService.getCompanyById(companyId);

//   // const teamsResult: any = await Promise.all(
//   //   teams.map(async (team: any) => {
//   //     return await this.getAvgResultForTeam(surveyId, team._id.toString());
//   //   }),
//   // );

//   // const teamsResultFlat = [];
//   // for (const res of teamsResult) {
//   //   teamsResultFlat.push(res);
//   // }

//   // const surveyResult = {};

//   // schema.forEach((obj) => {
//   //   const avgTrends = [];

//   //   let trendCount = 0;
//   //   let counter = 0;
//   //   teamsResultFlat.forEach((surveyAnswer) => {
//   //     if (surveyAnswer[obj.category]) {
//   //       surveyAnswer[obj.category].avgTrends.forEach((avgTrend) => {
//   //         if (obj.trend === avgTrend.trendId) {
//   //           trendCount += avgTrend.avgTrendAnswer;
//   //           counter++;
//   //         }
//   //       });
//   //     }
//   //   });

//   //   avgTrends.push({
//   //     trendId: obj.trend,
//   //     trendPrimary: obj.trendPrimary,
//   //     trendSecondary: obj.trendSecondary,
//   //     avgTrendAnswer: trendCount / counter,
//   //   });

//   //   if (surveyResult[obj.category]) {
//   //     surveyResult[obj.category] = {
//   //       categoryTitle: obj.categoryTitle,
//   //       categoryId: obj.category,
//   //       avgTrends: [...avgTrends, ...surveyResult[obj.category].avgTrends],
//   //     };
//   //   } else {
//   //     surveyResult[obj.category] = {
//   //       categoryTitle: obj.categoryTitle,
//   //       categoryId: obj.category,
//   //       avgTrends,
//   //     };
//   //   }
//   // });

//   // return surveyResult;
// }
