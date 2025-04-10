import React, { useState, useEffect, useRef } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import {
  getCollaborativeRecommendations,
  getContentRecommendations,
  Recommendation,
  Recommendations,
} from '../api/ContentRecommender';
import { fetchUserRatedMovies, getAzureRecs, Rating } from '../api/MoviesApi';

// Define types for the merged items.
type CollabRecMerged = { type: 'collab'; rec: Recommendations };
type ContentRecMerged = { type: 'content'; rec: { genre: string; movies: Recommendation[] } };
type MergedRec = CollabRecMerged | ContentRecMerged;

export const MoviesPage: React.FC = () => {
  const [listOfIds, setListOfIds] = useState<string[]>([]);
  const [azureMovieRecommendations, setAzureMovieRecommendations] = useState<Recommendation[]>([]);
  const [azureCalled, setAzureCalled] = useState(false);
  const userId = 1;
  const [allRecs, setAllRecs] = useState<Recommendations[]>([]);
  const [collabRecs, setCollabRecs] = useState<Recommendations[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // For infinite scroll on the merged items:
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Final randomized merged recommendations array.
  const [randomizedRecs, setRandomizedRecs] = useState<MergedRec[]>([]);
  const [idsInCollab] = ['s1004', 's1005', 's1006', 's1007', 's1018', 's1028', 's1037', 's1040', 's1041', 's1060', 's1061', 's1063', 's1068', 's1073', 's1078', 's1079', 's1080', 's1081', 's1083', 's1085', 's1087', 's1096', 's11', 's1102', 's1109', 's1114', 's1115', 's1119', 's1128', 's1134', 's1138', 's1144', 's1146', 's1147', 's1148', 's115', 's1157', 's116', 's1173', 's1174', 's1187', 's119', 's1191', 's1195', 's12', 's120', 's1207', 's1208', 's1211', 's1216', 's1221', 's1226', 's1231', 's124', 's1256', 's1257', 's1261', 's1269', 's127', 's1276', 's1277', 's1288', 's1290', 's1300', 's1303', 's1306', 's131', 's1318', 's1323', 's1325', 's1333', 's1335', 's1336', 's1339', 's1350', 's1357', 's1363', 's1365', 's1366', 's1373', 's1374', 's1377', 's1378', 's1384', 's1402', 's1403', 's1409', 's1416', 's1420', 's1429', 's1430', 's1433', 's1438', 's1448', 's1449', 's1454', 's1455', 's1457', 's146', 's1461', 's1463', 's1465', 's1466', 's1468', 's1474', 's1479', 's1484', 's1488', 's1492', 's1493', 's1515', 's1517', 's1524', 's1526', 's1530', 's1533', 's1534', 's1540', 's1547', 's155', 's1553', 's1555', 's1563', 's1567', 's1571', 's1574', 's1580', 's1581', 's1584', 's1586', 's1594', 's1599', 's1602', 's1607', 's162', 's1627', 's1629', 's1630', 's1635', 's1636', 's1642', 's1644', 's1659', 's166', 's1669', 's167', 's1673', 's1674', 's1675', 's1681', 's1689', 's169', 's1690', 's1691', 's1692', 's1696', 's1697', 's1699', 's1700', 's1702', 's1707', 's1715', 's1717', 's1731', 's1744', 's175', 's1753', 's1757', 's177', 's1771', 's1776', 's178', 's1783', 's179', 's1793', 's1795', 's18', 's180', 's1801', 's1808', 's181', 's1810', 's1811', 's1814', 's1818', 's1819', 's1826', 's1834', 's1840', 's1841', 's1842', 's1844', 's1851', 's1852', 's1854', 's1855', 's1859', 's187', 's1874', 's1879', 's188', 's1896', 's190', 's1906', 's1911', 's1917', 's1921', 's1924', 's1926', 's1927', 's1929', 's193', 's1930', 's1936', 's1939', 's1940', 's1941', 's1947', 's1948', 's1949', 's1950', 's1952', 's1958', 's1966', 's1971', 's1972', 's1979', 's1980', 's1981', 's1982', 's1985', 's1989', 's1991', 's1994', 's2', 's20', 's2002', 's2003', 's2005', 's2007', 's2008', 's2020', 's2038', 's2043', 's2048', 's2055', 's2058', 's206', 's2062', 's2067', 's2068', 's2069', 's2072', 's2074', 's2087', 's2103', 's2107', 's2114', 's2115', 's2116', 's2122', 's2123', 's2125', 's2128', 's2129', 's2135', 's214', 's2142', 's2143', 's2145', 's2149', 's2153', 's2166', 's2171', 's2175', 's2176', 's2179', 's2180', 's2181', 's2186', 's2191', 's2196', 's22', 's220', 's2203', 's2208', 's2213', 's2223', 's2237', 's224', 's2246', 's2247', 's2248', 's225', 's2254', 's2255', 's2259', 's2269', 's2273', 's2275', 's2285', 's2289', 's229', 's2294', 's2307', 's2310', 's2314', 's2320', 's2323', 's2325', 's2333', 's234', 's2343', 's235', 's2350', 's2355', 's2358', 's2359', 's2361', 's2362', 's2363', 's2368', 's237', 's2372', 's2376', 's2378', 's2379', 's2381', 's2383', 's2389', 's2391', 's2394', 's24', 's2402', 's241', 's2412', 's2418', 's242', 's2420', 's243', 's2432', 's2433', 's244', 's2441', 's2448', 's2449', 's2450', 's2453', 's2455', 's246', 's2464', 's2465', 's2469', 's2471', 's2472', 's2480', 's2484', 's2487', 's2489', 's249', 's2498', 's2500', 's2501', 's2509', 's251', 's2513', 's2515', 's2516', 's2519', 's2523', 's2525', 's2526', 's2533', 's2546', 's2549', 's2552', 's2562', 's2564', 's2568', 's2569', 's2570', 's2575', 's2577', 's2593', 's2594', 's26', 's2602', 's2604', 's2613', 's2622', 's263', 's2636', 's2637', 's264', 's2645', 's2646', 's2658', 's267', 's2671', 's268', 's2685', 's2688', 's2692', 's2695', 's2699', 's2704', 's2706', 's2711', 's2721', 's2731', 's2737', 's2752', 's276', 's2762', 's2768', 's2775', 's2784', 's2792', 's2794', 's2795', 's2796', 's2798', 's280', 's2800', 's2811', 's2812', 's2827', 's2830', 's2836', 's2841', 's2845', 's2850', 's2853', 's2855', 's2863', 's2864', 's2867', 's2877', 's2879', 's288', 's2886', 's2888', 's289', 's2894', 's2909', 's2916', 's2917', 's2918', 's2922', 's2923', 's2924', 's2928', 's2932', 's2933', 's294', 's2942', 's2952', 's2954', 's2958', 's2960', 's297', 's2972', 's2978', 's2979', 's2985', 's2991', 's2992', 's2995', 's2998', 's30', 's3002', 's301', 's3011', 's3020', 's3021', 's3025', 's3031', 's3033', 's3041', 's3048', 's3051', 's3054', 's3061', 's3066', 's3067', 's3070', 's3075', 's3077', 's3088', 's31', 's3104', 's3110', 's3111', 's3120', 's3121', 's3130', 's3131', 's3134', 's3138', 's3139', 's3145', 's3149', 's315', 's3154', 's3158', 's3159', 's3162', 's3163', 's3181', 's3183', 's3186', 's3188', 's3193', 's32', 's3203', 's3210', 's3213', 's322', 's3226', 's3237', 's3239', 's324', 's3243', 's3246', 's3247', 's3248', 's325', 's3250', 's3256', 's3264', 's3267', 's327', 's3272', 's3274', 's3278', 's3281', 's3282', 's3292', 's3294', 's3295', 's3302', 's3329', 's333', 's3337', 's3338', 's3343', 's3350', 's3352', 's3353', 's3359', 's3362', 's3364', 's3367', 's3368', 's3371', 's3380', 's3391', 's3395', 's3416', 's3417', 's3418', 's3421', 's3423', 's3424', 's3425', 's3434', 's3435', 's3443', 's3446', 's3449', 's3450', 's3453', 's3454', 's3455', 's3458', 's3460', 's3462', 's3466', 's3474', 's3477', 's3486', 's3487', 's3492', 's3493', 's3495', 's3498', 's3504', 's3518', 's3522', 's3525', 's3527', 's3551', 's3552', 's3556', 's3561', 's3562', 's3570', 's3579', 's3581', 's3582', 's3583', 's3588', 's359', 's3590', 's36', 's3600', 's3604', 's3605', 's3608', 's3609', 's3613', 's3615', 's3638', 's364', 's3641', 's3643', 's3654', 's3655', 's3664', 's3665', 's3668', 's3673', 's3674', 's3675', 's368', 's3680', 's3686', 's3688', 's3689', 's369', 's3697', 's37', 's370', 's3707', 's3708', 's371', 's3721', 's3723', 's3726', 's3737', 's3738', 's3740', 's3742', 's3749', 's3756', 's376', 's3760', 's3764', 's3765', 's3768', 's3781', 's3788', 's3790', 's3794', 's3801', 's3807', 's3809', 's3814', 's3820', 's3823', 's3824', 's3838', 's3841', 's3847', 's3850', 's3852', 's3866', 's3867', 's3879', 's388', 's3880', 's3881', 's3882', 's3884', 's3885', 's3887', 's3888', 's3892', 's3893', 's3895', 's3897', 's3899', 's3904', 's3908', 's3910', 's3914', 's392', 's3921', 's3929', 's393', 's3931', 's3933', 's3936', 's3937', 's3939', 's3941', 's3950', 's3954', 's3955', 's3957', 's3966', 's397', 's3970', 's3974', 's3975', 's3977', 's3979', 's398', 's3980', 's3981', 's3990', 's3993', 's3995', 's3996', 's3999', 's4', 's400', 's401', 's4014', 's4015', 's4016', 's4023', 's4026', 's4028', 's4030', 's4031', 's4032', 's4033', 's4042', 's4045', 's4047', 's4065', 's4069', 's4071', 's4072', 's4085', 's4089', 's4090', 's4097', 's41', 's4107', 's4111', 's4116', 's4117', 's4119', 's4120', 's4121', 's4125', 's4127', 's4130', 's4131', 's4137', 's4138', 's4140', 's4141', 's4143', 's4145', 's4153', 's4161', 's4164', 's4167', 's4172', 's4184', 's4192', 's42', 's4203', 's4204', 's4208', 's4209', 's4219', 's422', 's4225', 's4229', 's4232', 's4235', 's4237', 's4248', 's4249', 's4253', 's4257', 's4259', 's426', 's4265', 's4266', 's4272', 's4273', 's4275', 's4277', 's4278', 's4290', 's4296', 's4297', 's43', 's4310', 's4312', 's4315', 's4316', 's4321', 's4323', 's4330', 's4331', 's4346', 's4351', 's4357', 's4361', 's4364', 's4367', 's4369', 's437', 's4377', 's4384', 's4386', 's4390', 's4396', 's4401', 's4410', 's4411', 's4412', 's4415', 's4419', 's442', 's4423', 's4425', 's4428', 's443', 's4435', 's4437', 's444', 's4440', 's4447', 's4448', 's4461', 's4471', 's4477', 's4482', 's4484', 's4485', 's4488', 's4489', 's449', 's4490', 's4493', 's4495', 's450', 's4504', 's4512', 's4516', 's452', 's4524', 's4525', 's4530', 's4531', 's4536', 's4537', 's4550', 's4551', 's4552', 's4553', 's4561', 's4564', 's4566', 's4567', 's4571', 's4572', 's458', 's4589', 's459', 's4594', 's4599', 's46', 's460', 's4605', 's4606', 's4611', 's4615', 's4619', 's4622', 's4625', 's4634', 's4636', 's4638', 's4644', 's4646', 's4648', 's4652', 's466', 's4663', 's4672', 's4673', 's4675', 's4676', 's4679', 's4684', 's4686', 's4688', 's4691', 's4692', 's4701', 's4704', 's4707', 's4708', 's4711', 's4712', 's4724', 's4727', 's473', 's4730', 's4738', 's4742', 's4748', 's4750', 's4760', 's4766', 's4768', 's4771', 's4772', 's4776', 's478', 's4781', 's4793', 's4797', 's4798', 's4806', 's481', 's4811', 's4816', 's4819', 's4825', 's4829', 's4834', 's4837', 's4843', 's4846', 's4847', 's4853', 's4858', 's4860', 's4866', 's4868', 's487', 's4870', 's4872', 's4882', 's4901', 's4905', 's4906', 's4907', 's4909', 's4910', 's4914', 's492', 's4920', 's4922', 's493', 's4937', 's4938', 's494', 's4942', 's4948', 's4950', 's4952', 's4953', 's4958', 's496', 's4960', 's4961', 's4969', 's4979', 's4981', 's4983', 's4985', 's4986', 's4989', 's4991', 's4999', 's5', 's5003', 's5005', 's5012', 's5013', 's5014', 's5015', 's5028', 's5035', 's5036', 's5037', 's5038', 's5046', 's5059', 's5061', 's5070', 's5074', 's5075', 's5078', 's5081', 's5096', 's5098', 's5100', 's5104', 's5108', 's5111', 's5113', 's5116', 's5122', 's5125', 's5129', 's5134', 's5136', 's5137', 's515', 's5160', 's5170', 's5181', 's5184', 's5192', 's5196', 's5206', 's5211', 's5216', 's5219', 's5232', 's5237', 's5238', 's524', 's5240', 's5245', 's5246', 's5248', 's5256', 's5263', 's5267', 's5275', 's5279', 's5281', 's5288', 's5290', 's5293', 's5297', 's5301', 's5303', 's5305', 's5310', 's532', 's5327', 's533', 's5331', 's5335', 's5341', 's5348', 's5351', 's5354', 's5355', 's5357', 's5362', 's5364', 's5366', 's5370', 's5383', 's5384', 's5389', 's539', 's5396', 's5398', 's5399', 's540', 's5402', 's5410', 's5411', 's5413', 's542', 's5429', 's5430', 's5436', 's5438', 's544', 's5440', 's5445', 's5448', 's545', 's5451', 's5456', 's5471', 's5480', 's5481', 's5482', 's5484', 's5489', 's5492', 's5497', 's5509', 's5511', 's552', 's5525', 's5529', 's554', 's5540', 's5549', 's557', 's5571', 's5581', 's559', 's5592', 's5597', 's5599', 's5601', 's5604', 's561', 's5619', 's563', 's5631', 's5639', 's564', 's5640', 's5641', 's5649', 's5651', 's566', 's5666', 's5672', 's5675', 's5676', 's5678', 's568', 's5682', 's5685', 's5691', 's5693', 's5695', 's5699', 's57', 's5701', 's5732', 's5733', 's5744', 's5745', 's5750', 's5752', 's5754', 's5763', 's5764', 's5769', 's5777', 's5779', 's5783', 's58', 's5803', 's5808', 's582', 's5821', 's5829', 's5843', 's5845', 's5846', 's5854', 's5855', 's5857', 's5858', 's5881', 's5883', 's5889', 's5899', 's59', 's5905', 's5909', 's591', 's5916', 's5920', 's5928', 's5935', 's5941', 's5942', 's5946', 's5948', 's595', 's5954', 's5955', 's5964', 's5967', 's597', 's5974', 's5977', 's598', 's5981', 's5985', 's5992', 's5995', 's5999', 's6', 's6016', 's6026', 's6033', 's6041', 's6050', 's6054', 's6068', 's6077', 's6079', 's6081', 's6088', 's6092', 's61', 's6101', 's6103', 's6105', 's6110', 's6111', 's6112', 's6116', 's6118', 's6128', 's6138', 's6150', 's6157', 's6158', 's6162', 's6167', 's6178', 's6181', 's6185', 's6188', 's619', 's6195', 's6199', 's62', 's6209', 's6218', 's6219', 's6221', 's6239', 's6240', 's6245', 's6247', 's6251', 's6254', 's6264', 's6278', 's628', 's6281', 's6284', 's6290', 's6293', 's6298', 's6300', 's6301', 's6302', 's6306', 's6313', 's6316', 's6319', 's632', 's6324', 's6343', 's6345', 's635', 's6352', 's6354', 's6356', 's6358', 's6359', 's637', 's6373', 's6375', 's6386', 's6388', 's6390', 's6399', 's64', 's640', 's6405', 's6409', 's6420', 's6424', 's6425', 's6427', 's643', 's6445', 's6446', 's6448', 's6449', 's6450', 's6452', 's6465', 's6474', 's6476', 's6481', 's6488', 's6502', 's6506', 's6508', 's6510', 's6515', 's6521', 's6543', 's655', 's6557', 's6564', 's6568', 's6569', 's657', 's6573', 's6587', 's6592', 's6599', 's660', 's6601', 's6604', 's6607', 's6608', 's6614', 's662', 's6635', 's6636', 's6647', 's6648', 's6652', 's6658', 's666', 's6660', 's6664', 's667', 's6672', 's6673', 's6674', 's6676', 's669', 's670', 's6702', 's671', 's6711', 's6713', 's6718', 's6729', 's6733', 's6735', 's674', 's6741', 's6743', 's6744', 's6751', 's6754', 's6755', 's6764', 's6777', 's6786', 's6788', 's679', 's6803', 's6805', 's6819', 's6831', 's6835', 's6839', 's6843', 's6844', 's6847', 's6851', 's6858', 's6861', 's6865', 's687', 's6874', 's6881', 's6890', 's6901', 's6904', 's6908', 's6918', 's693', 's6931', 's6933', 's6938', 's694', 's6940', 's6942', 's6944', 's6947', 's6950', 's6952', 's6958', 's6964', 's6966', 's6971', 's6975', 's698', 's6987', 's6996', 's700', 's7007', 's701', 's7017', 's7023', 's7026', 's7029', 's7039', 's7040', 's7050', 's7054', 's7055', 's707', 's7070', 's7071', 's7072', 's7079', 's7081', 's7082', 's7088', 's7090', 's7095', 's710', 's7105', 's7119', 's7121', 's7126', 's7128', 's7131', 's7143', 's7148', 's7152', 's7153', 's7165', 's7170', 's7176', 's7177', 's7181', 's7182', 's7188', 's7204', 's721', 's7210', 's7223', 's7224', 's7228', 's7244', 's7246', 's7259', 's7265', 's7267', 's7269', 's7280', 's7285', 's7289', 's7291', 's7296', 's7299', 's73', 's7303', 's7307', 's7311', 's7331', 's7342', 's7350', 's7353', 's7355', 's7360', 's7361', 's7378', 's7379', 's7382', 's7383', 's739', 's7390', 's7393', 's7403', 's7416', 's7417', 's7418', 's7419', 's7421', 's7431', 's7434', 's7436', 's7439', 's7447', 's745', 's7466', 's7469', 's7484', 's7493', 's7497', 's7498', 's750', 's7500', 's7505', 's7506', 's7511', 's7522', 's7526', 's7527', 's7531', 's7534', 's7536', 's7541', 's7544', 's7548', 's7554', 's7555', 's7560', 's7570', 's7572', 's7575', 's758', 's7588', 's7589', 's7595', 's7599', 's7600', 's7613', 's7623', 's7624', 's7626', 's7629', 's763', 's7635', 's7637', 's764', 's7641', 's7642', 's7647', 's7651', 's7656', 's7673', 's7682', 's7685', 's7690', 's7695', 's7700', 's771', 's7711', 's7713', 's7719', 's772', 's7721', 's7726', 's7730', 's7731', 's7733', 's7738', 's7739', 's7743', 's7748', 's775', 's7750', 's7752', 's7759', 's7762', 's777', 's7778', 's7783', 's779', 's7796', 's7797', 's7799', 's7807', 's7808', 's7817', 's7828', 's7832', 's7839', 's7840', 's7843', 's7845', 's7848', 's7857', 's7858', 's7863', 's7864', 's7866', 's7868', 's7871', 's7876', 's7883', 's7895', 's790', 's7903', 's7929', 's7935', 's794', 's7941', 's7943', 's7954', 's7955', 's7966', 's7968', 's7969', 's7982', 's7985', 's799', 's7992', 's8002', 's801', 's8014', 's8019', 's8022', 's8023', 's8025', 's8031', 's8032', 's8038', 's8055', 's8057', 's8059', 's806', 's8060', 's8079', 's8083', 's8084', 's8090', 's8093', 's8094', 's8105', 's811', 's8125', 's8129', 's8132', 's8135', 's8138', 's8139', 's8140', 's8141', 's8148', 's8152', 's8155', 's8161', 's8173', 's8175', 's8180', 's8182', 's8186', 's8187', 's8190', 's8195', 's8199', 's820', 's8203', 's8204', 's8205', 's8207', 's8209', 's821', 's8210', 's8218', 's822', 's8221', 's8222', 's8228', 's8235', 's8238', 's8249', 's8260', 's8261', 's8262', 's8265', 's827', 's8276', 's8277', 's8278', 's828', 's8292', 's8294', 's8299', 's8300', 's8306', 's831', 's8310', 's832', 's8329', 's8331', 's8333', 's834', 's8340', 's8343', 's8347', 's835', 's8351', 's8354', 's8359', 's836', 's8362', 's8369', 's8380', 's8381', 's8382', 's8383', 's8385', 's8393', 's8395', 's8399', 's8402', 's8404', 's8412', 's842', 's8427', 's8436', 's8437', 's8438', 's8439', 's844', 's8461', 's8466', 's8467', 's8477', 's848', 's8484', 's8486', 's8487', 's849', 's8490', 's8492', 's8497', 's850', 's851', 's8513', 's8514', 's8515', 's8521', 's8523', 's8527', 's8528', 's8532', 's8534', 's8545', 's8548', 's8551', 's856', 's8563', 's8568', 's8575', 's8577', 's8580', 's8582', 's8595', 's8597', 's8605', 's8613', 's8623', 's8624', 's8626', 's8627', 's8630', 's8636', 's8640', 's8643', 's8644', 's8646', 's8650', 's8653', 's8654', 's8658', 's8669', 's8685', 's8687', 's8689', 's8694', 's8698', 's8701', 's8704', 's8712', 's8713', 's8714', 's872', 's8724', 's8732', 's8743', 's8750', 's8755', 's8756', 's876', 's8762', 's8763', 's8766', 's8771', 's8782', 's8784', 's8787', 's8796', 's88', 's880', 's8804', 's8805', 's8807', 's881', 's883', 's884', 's887', 's898', 's90', 's906', 's909', 's910', 's914', 's915', 's92', 's920', 's925', 's928', 's934', 's936', 's937', 's953', 's962', 's966', 's968', 's973', 's977', 's98', 's985', 's988', 's990', 's994']

  // 1. Fetch user-rated movies.
  useEffect(() => {
    fetchUserRatedMovies(userId)
      .then((data) => {
        const showIds = data.map((r: Rating) => r.show_id);
        setListOfIds(showIds);
      })
      .catch((err) => console.error('Error fetching user rated movies:', err));
  }, [userId]);

  // 2. Fetch recommendations when listOfIds is updated.
  useEffect(() => {
    if (listOfIds.length > 0) {
      // Get Azure recommendations.
      getAzureRecs(userId)
        .then((data) => {
          setAzureMovieRecommendations(data);
          setAzureCalled(true);
          console.log('Azure movie recommendations:', data);
        })
        .catch((err) => console.error(err));

      // Get Content Recommendations.
      
      Promise.allSettled(listOfIds.map((id) => getContentRecommendations(id)))
        .then((results) => {
          const successResults = results
            .filter(
              (result): result is PromiseFulfilledResult<Recommendations> =>
                result.status === 'fulfilled'
            )
            .map((result) => result.value);
          console.log('Successfully fetched content recommendations:', successResults);
          setAllRecs(successResults);
        })
        .catch((error) =>
          console.error('Error fetching content recommendations:', error)
        );
        const filteredIds = listOfIds.filter((id) => idsInCollab.includes(id));
      // Get Collaborative Recommendations.
      Promise.allSettled(filteredIds.map((id) => getCollaborativeRecommendations(id)))
        .then((results) => {
          const successResults = results
            .filter(
              (result): result is PromiseFulfilledResult<Recommendations> =>
                result.status === 'fulfilled'
            )
            .map((result) => result.value);
          console.log('Successfully fetched collaborative recommendations:', successResults);
          setCollabRecs(successResults);
        })
        .catch((error) =>
          console.error('Error fetching collaborative recommendations:', error)
        );
    }
  }, [listOfIds, userId]);

  // 3. Group the content recommendations by genre.
  // We assume that each Recommendations object has a property "recommendations"
  // which is an array of Recommendation objects. Each Recommendation has a 'genre'
  // property that can be a comma-separated list.
  const contentMovies: Recommendation[] = allRecs.flatMap((rec) => rec.recommendations);

  const moviesByGenre: { [genre: string]: Recommendation[] } = contentMovies.reduce((acc, movie) => {
    const rawGenre = movie.genre || 'Other';
    const genreList = rawGenre.split(',').map((g) => g.trim());
    genreList.forEach((genre) => {
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(movie);
    });
    return acc;
  }, {} as { [genre: string]: Recommendation[] });

  // Convert grouped object into an array of content items.
  const contentItems: ContentRecMerged[] = Object.entries(moviesByGenre).map(([genre, movies]) => ({
    type: 'content' as const,
    rec: { genre, movies },
  }));

  // Map collaborative recommendations into an array of collab items.
  const collabItems: CollabRecMerged[] = collabRecs.map((rec) => ({
    type: 'collab' as const,
    rec,
  }));

  // 4. Merge the two arrays, then shuffle and save to state.
  useEffect(() => {
    // Only merge if we have data in one or both arrays.
    if (collabItems.length === 0 && contentItems.length === 0) return;

    const merged: MergedRec[] = [...collabItems, ...contentItems];

    // Helper: Shuffle an array using Fisher-Yates.
    function shuffleArray<T>(array: T[]): T[] {
      const arr = array.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const shuffled = shuffleArray(merged);
    setRandomizedRecs(shuffled);
  }, [collabRecs, allRecs]);

  // 5. Infinite scroll: Increase visibleCount when the sentinel is in view.
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < randomizedRecs.length) {
          setVisibleCount((prev) => prev + 2);
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(sentinelRef.current);
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [visibleCount, randomizedRecs.length]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <br />
      <div className="container">
        <h3>Browse Movies</h3>
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
        />

        {/* Render Azure recommendations at the top if available */}
        {azureCalled && (
          <MovieList 
            key={`azure-${userId}`}
            recommender="Movies For You"
            movies={azureMovieRecommendations}
          />
        )}

        {/* Render merged and randomized recommendations with infinite scroll */}
        {randomizedRecs.slice(0, visibleCount).map((item) => {
          if (item.type === 'collab') {
            return (
              <MovieList
                key={`collab-${item.rec.basedOffOf}`}
                recommender={`People who like ${item.rec.basedOffOf} also like`}
                movies={item.rec.recommendations}
              />
            );
          } else if (item.type === 'content') {
            return (
              <MovieList
                key={item.rec.genre}
                recommender={`${item.rec.genre} movies and shows you might like`}
                movies={item.rec.movies}
              />
            );
          }
          return null;
        })}

        {/* Sentinel element to trigger infinite scroll */}
        <div ref={sentinelRef} style={{ height: '1px' }}></div>
      </div>
      <br/>
      <br/>
      <br/>
      <Footer />
    </div>
  );
};
